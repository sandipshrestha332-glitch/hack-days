import { useState } from 'react';
import { Plus, Flame, Beef, Wheat, Droplets, Calendar } from 'lucide-react';
import type { FoodLogEntry, MealType, MacroTargets, Food, UserProfile } from '../types';
import { MacroCard } from '../components/MacroCard';
import { MealCard } from '../components/MealCard';
import { MacroChart } from '../components/MacroChart';
import { NutritionSummary } from '../components/NutritionSummary';
import { AddFoodModal } from '../components/AddFoodModal';
import { CustomFoodModal } from '../components/CustomFoodModal';
import { ProgressRing } from '../components/ProgressRing';
import { formatNumber } from '../calculations';

interface DashboardProps {
  profile: UserProfile;
  targets: MacroTargets;
  todayEntries: FoodLogEntry[];
  totals: { calories: number; protein: number; carbs: number; fat: number };
  allFoods: Food[];
  onAddFood: (food: Food, servings: number, meal: MealType) => void;
  onRemoveFood: (id: string) => void;
  onCreateCustomFood: (food: Omit<Food, 'id' | 'isCustom'>) => void;
}

const mealOrder: MealType[] = ['breakfast', 'lunch', 'dinner', 'snacks'];

export function Dashboard({
  profile,
  targets,
  todayEntries,
  totals,
  allFoods,
  onAddFood,
  onRemoveFood,
  onCreateCustomFood,
}: DashboardProps) {
  const [showAddFood, setShowAddFood] = useState(false);
  const [showCustomFood, setShowCustomFood] = useState(false);
  const [defaultMeal, setDefaultMeal] = useState<MealType>('breakfast');

  const calPct = targets.calories > 0 ? Math.round((totals.calories / targets.calories) * 100) : 0;

  const handleOpenAddFood = (meal?: MealType) => {
    if (meal) setDefaultMeal(meal);
    setShowAddFood(true);
  };

  const handleAddFood = (food: Food, servings: number, meal: MealType) => {
    onAddFood(food, servings, meal);
    setShowAddFood(false);
  };

  const entriesByMeal = (meal: MealType) => todayEntries.filter(e => e.meal === meal);

  const now = new Date();
  const greeting = now.getHours() < 12 ? 'Good morning' : now.getHours() < 17 ? 'Good afternoon' : 'Good evening';
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-surface-900">
          {greeting}, {profile.name.split(' ')[0]}! 👋
        </h1>
        <div className="flex items-center gap-2 mt-1">
          <Calendar size={14} className="text-surface-400" />
          <p className="text-sm text-surface-500">{dateStr}</p>
        </div>
      </div>

      {/* Hero Calorie Card */}
      <div className="bg-gradient-to-r from-primary to-primary-dark rounded-2xl p-4 sm:p-6 text-white shadow-lg shadow-primary/20">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-white/70 text-sm font-medium mb-1">Today's Calories</p>
            <p className="text-3xl sm:text-4xl font-bold">
              {formatNumber(Math.round(totals.calories))}
              <span className="text-lg font-normal text-white/60 ml-1">/ {formatNumber(targets.calories)}</span>
            </p>
            <p className="text-white/60 text-sm mt-1">
              {Math.max(targets.calories - Math.round(totals.calories), 0)} kcal remaining
            </p>
          </div>
          <ProgressRing
            progress={Math.min(calPct, 100)}
            size={90}
            strokeWidth={7}
            color="rgba(255,255,255,0.9)"
            bgColor="rgba(255,255,255,0.2)"
          >
            <span className="text-lg font-bold text-white">{calPct}%</span>
          </ProgressRing>
        </div>
      </div>

      {/* Macro Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 stagger-children">
        <MacroCard
          label="Calories"
          current={totals.calories}
          target={targets.calories}
          unit="kcal"
          color="#f97316"
          bgColor="#fed7aa"
          lightBg="#fff7ed"
          icon={<Flame size={18} />}
        />
        <MacroCard
          label="Protein"
          current={totals.protein}
          target={targets.protein}
          unit="g"
          color="#3b82f6"
          bgColor="#bfdbfe"
          lightBg="#eff6ff"
          icon={<Beef size={18} />}
        />
        <MacroCard
          label="Carbs"
          current={totals.carbs}
          target={targets.carbs}
          unit="g"
          color="#8b5cf6"
          bgColor="#c4b5fd"
          lightBg="#f5f3ff"
          icon={<Wheat size={18} />}
        />
        <MacroCard
          label="Fat"
          current={totals.fat}
          target={targets.fat}
          unit="g"
          color="#eab308"
          bgColor="#fde68a"
          lightBg="#fefce8"
          icon={<Droplets size={18} />}
        />
      </div>

      {/* Quick Add Button */}
      <button
        onClick={() => handleOpenAddFood()}
        className="w-full py-3.5 rounded-2xl border-2 border-dashed border-primary/30 text-primary-dark font-semibold text-sm flex items-center justify-center gap-2 hover:bg-primary-light hover:border-primary/50 transition-all duration-200"
      >
        <Plus size={18} />
        Quick Add Food
      </button>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Meals - Left Column */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-surface-900">Today's Meals</h2>
          {mealOrder.map(meal => (
            <MealCard
              key={meal}
              mealType={meal}
              entries={entriesByMeal(meal)}
              onRemove={onRemoveFood}
              onAddFood={handleOpenAddFood}
            />
          ))}
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <MacroChart
            protein={totals.protein}
            carbs={totals.carbs}
            fat={totals.fat}
            proteinTarget={targets.protein}
            carbsTarget={targets.carbs}
            fatTarget={targets.fat}
          />
          <NutritionSummary totals={totals} targets={targets} />
        </div>
      </div>

      {/* Modals */}
      <AddFoodModal
        isOpen={showAddFood}
        onClose={() => setShowAddFood(false)}
        foods={allFoods}
        onAddFood={handleAddFood}
        onCreateCustom={() => { setShowAddFood(false); setShowCustomFood(true); }}
        defaultMeal={defaultMeal}
      />
      <CustomFoodModal
        isOpen={showCustomFood}
        onClose={() => setShowCustomFood(false)}
        onSave={(food) => { onCreateCustomFood(food); setShowCustomFood(false); }}
      />
    </div>
  );
}
