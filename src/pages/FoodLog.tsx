import { useState, useMemo } from 'react';
import { Search, Plus, Trash2, ChefHat, Filter } from 'lucide-react';
import type { FoodLogEntry, MealType, Food } from '../types';
import { getTodayString } from '../calculations';
import { AddFoodModal } from '../components/AddFoodModal';
import { CustomFoodModal } from '../components/CustomFoodModal';

interface FoodLogProps {
  entries: FoodLogEntry[];
  allFoods: Food[];
  onAddFood: (food: Food, servings: number, meal: MealType) => void;
  onRemoveFood: (id: string) => void;
  onCreateCustomFood: (food: Omit<Food, 'id' | 'isCustom'>) => void;
}

const mealLabels: Record<MealType, { label: string; emoji: string }> = {
  breakfast: { label: 'Breakfast', emoji: '🌅' },
  lunch: { label: 'Lunch', emoji: '☀️' },
  dinner: { label: 'Dinner', emoji: '🌙' },
  snacks: { label: 'Snacks', emoji: '🍎' },
};

export function FoodLog({ entries, allFoods, onAddFood, onRemoveFood, onCreateCustomFood }: FoodLogProps) {
  const [showAddFood, setShowAddFood] = useState(false);
  const [showCustomFood, setShowCustomFood] = useState(false);
  const [search, setSearch] = useState('');
  const [filterMeal, setFilterMeal] = useState<MealType | 'all'>('all');

  const today = getTodayString();
  const todayEntries = entries.filter(e => e.date === today);

  const filteredEntries = useMemo(() => {
    let result = todayEntries;
    if (filterMeal !== 'all') {
      result = result.filter(e => e.meal === filterMeal);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(e => e.foodName.toLowerCase().includes(q));
    }
    return result.sort((a, b) => b.timestamp - a.timestamp);
  }, [todayEntries, filterMeal, search]);

  const totalCal = todayEntries.reduce((s, e) => s + e.calories, 0);
  const totalProtein = todayEntries.reduce((s, e) => s + e.protein, 0);
  const totalCarbs = todayEntries.reduce((s, e) => s + e.carbs, 0);
  const totalFat = todayEntries.reduce((s, e) => s + e.fat, 0);

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Food Log</h1>
          <p className="text-sm text-surface-500 mt-1">Today's food entries</p>
        </div>
        <button
          onClick={() => setShowAddFood(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white font-medium text-sm shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
        >
          <Plus size={16} />
          Add Food
        </button>
      </div>

      {/* Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 stagger-children">
        <div className="bg-cal-light rounded-xl p-3 text-center">
          <p className="text-xs text-cal-dark font-medium">Calories</p>
          <p className="text-lg font-bold text-cal">{Math.round(totalCal)}</p>
        </div>
        <div className="bg-protein-light rounded-xl p-3 text-center">
          <p className="text-xs text-protein-dark font-medium">Protein</p>
          <p className="text-lg font-bold text-protein">{Math.round(totalProtein)}g</p>
        </div>
        <div className="bg-carbs-light rounded-xl p-3 text-center">
          <p className="text-xs text-carbs-dark font-medium">Carbs</p>
          <p className="text-lg font-bold text-carbs">{Math.round(totalCarbs)}g</p>
        </div>
        <div className="bg-fat-light rounded-xl p-3 text-center">
          <p className="text-xs text-fat-dark font-medium">Fat</p>
          <p className="text-lg font-bold text-fat">{Math.round(totalFat)}g</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
          <input
            type="text"
            placeholder="Search entries..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-surface-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
          />
        </div>
        <div className="flex items-start sm:items-center gap-2 min-w-0">
          <Filter size={14} className="text-surface-400" />
          <div className="flex gap-1 overflow-x-auto pb-1 max-w-full">
            <button
              onClick={() => setFilterMeal('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filterMeal === 'all'
                  ? 'bg-primary-light text-primary-dark'
                  : 'text-surface-500 hover:bg-surface-100'
              }`}
            >
              All
            </button>
            {(Object.keys(mealLabels) as MealType[]).map(meal => (
              <button
                key={meal}
                onClick={() => setFilterMeal(meal)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  filterMeal === meal
                    ? 'bg-primary-light text-primary-dark'
                    : 'text-surface-500 hover:bg-surface-100'
                }`}
              >
                {mealLabels[meal].emoji} {mealLabels[meal].label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Entries List */}
      <div className="bg-white rounded-2xl border border-surface-200/60 shadow-sm overflow-hidden">
        {filteredEntries.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-surface-100 flex items-center justify-center mx-auto mb-4">
              <ChefHat size={28} className="text-surface-400" />
            </div>
            <p className="text-surface-500 font-medium">No food entries yet</p>
            <p className="text-sm text-surface-400 mt-1">Start tracking by adding your meals</p>
            <button
              onClick={() => setShowAddFood(true)}
              className="mt-4 px-6 py-2.5 rounded-xl bg-primary-light text-primary-dark font-medium text-sm hover:bg-primary hover:text-white transition-all"
            >
              + Add your first food
            </button>
          </div>
        ) : (
          <div className="divide-y divide-surface-100">
            {filteredEntries.map(entry => (
              <div key={entry.id} className="flex items-center gap-2 sm:gap-4 px-3 sm:px-5 py-4 hover:bg-surface-50/50 transition-colors group">
                <div className="w-10 h-10 rounded-xl bg-surface-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">{mealLabels[entry.meal].emoji}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-surface-800 truncate">{entry.foodName}</p>
                  <p className="text-xs text-surface-400">
                    {mealLabels[entry.meal].label} · {entry.servings} serving{entry.servings !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-semibold text-cal">{entry.calories} kcal</p>
                  <p className="text-xs text-surface-400">
                    P:{Math.round(entry.protein)}g C:{Math.round(entry.carbs)}g F:{Math.round(entry.fat)}g
                  </p>
                </div>
                <button
                  onClick={() => onRemoveFood(entry.id)}
                  className="opacity-100 sm:opacity-0 group-hover:opacity-100 focus-visible:opacity-100 w-8 h-8 rounded-lg flex items-center justify-center text-surface-300 hover:text-danger hover:bg-danger-light transition-all flex-shrink-0"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <AddFoodModal
        isOpen={showAddFood}
        onClose={() => setShowAddFood(false)}
        foods={allFoods}
        onAddFood={(food, servings, meal) => { onAddFood(food, servings, meal); setShowAddFood(false); }}
        onCreateCustom={() => { setShowAddFood(false); setShowCustomFood(true); }}
      />
      <CustomFoodModal
        isOpen={showCustomFood}
        onClose={() => setShowCustomFood(false)}
        onSave={(food) => { onCreateCustomFood(food); setShowCustomFood(false); }}
      />
    </div>
  );
}
