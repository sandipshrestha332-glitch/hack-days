import { useState, useMemo } from 'react';
import { X, Search, Plus, ChefHat, Minus } from 'lucide-react';
import type { Food, MealType } from '../types';

interface AddFoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  foods: Food[];
  onAddFood: (food: Food, servings: number, meal: MealType) => void;
  onCreateCustom: () => void;
  defaultMeal?: MealType;
}

const mealOptions: { value: MealType; label: string; emoji: string }[] = [
  { value: 'breakfast', label: 'Breakfast', emoji: '🌅' },
  { value: 'lunch', label: 'Lunch', emoji: '☀️' },
  { value: 'dinner', label: 'Dinner', emoji: '🌙' },
  { value: 'snacks', label: 'Snacks', emoji: '🍎' },
];

export function AddFoodModal({ isOpen, onClose, foods, onAddFood, onCreateCustom, defaultMeal }: AddFoodModalProps) {
  const [search, setSearch] = useState('');
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [servings, setServings] = useState(1);
  const [meal, setMeal] = useState<MealType>(defaultMeal ?? 'breakfast');

  const filteredFoods = useMemo(() => {
    if (!search.trim()) return foods;
    const q = search.toLowerCase();
    return foods.filter(f => f.name.toLowerCase().includes(q));
  }, [foods, search]);

  const handleAdd = () => {
    if (!selectedFood) return;
    onAddFood(selectedFood, servings, meal);
    // Reset
    setSelectedFood(null);
    setServings(1);
    setSearch('');
  };

  const handleClose = () => {
    setSelectedFood(null);
    setServings(1);
    setSearch('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center" onClick={handleClose}>
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in" />

      {/* Modal */}
      <div
        className="relative z-10 w-full sm:max-w-lg bg-white sm:rounded-2xl rounded-t-2xl shadow-2xl max-h-[85vh] flex flex-col animate-slide-in-up sm:animate-scale-in"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-surface-100">
          <h2 className="text-lg font-bold text-surface-900">Add Food</h2>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-surface-400 hover:bg-surface-100 hover:text-surface-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {selectedFood ? (
          /* ─── Food Detail ─── */
          <div className="p-5 space-y-5 overflow-y-auto">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center">
                <ChefHat size={22} className="text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-surface-900">{selectedFood.name}</h3>
                <p className="text-sm text-surface-500">{selectedFood.servingSize}</p>
              </div>
            </div>

            {/* Servings */}
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-2">Servings</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setServings(s => Math.max(0.5, s - 0.5))}
                  className="w-10 h-10 rounded-xl border border-surface-200 flex items-center justify-center text-surface-500 hover:bg-surface-50 transition-colors"
                >
                  <Minus size={16} />
                </button>
                <input
                  type="number"
                  min="0.5"
                  step="0.5"
                  value={servings}
                  onChange={e => setServings(Math.max(0.5, parseFloat(e.target.value) || 0.5))}
                  className="w-20 text-center text-xl font-bold text-surface-900 border border-surface-200 rounded-xl py-2 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
                <button
                  onClick={() => setServings(s => s + 0.5)}
                  className="w-10 h-10 rounded-xl border border-surface-200 flex items-center justify-center text-surface-500 hover:bg-surface-50 transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Meal selector */}
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-2">Meal</label>
              <div className="grid grid-cols-2 gap-2">
                {mealOptions.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setMeal(opt.value)}
                    className={`
                      py-2.5 px-3 rounded-xl text-sm font-medium transition-all duration-200 border
                      ${meal === opt.value
                        ? 'bg-primary-light border-primary text-primary-dark'
                        : 'border-surface-200 text-surface-600 hover:bg-surface-50'
                      }
                    `}
                  >
                    {opt.emoji} {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Nutrition preview */}
            <div className="bg-surface-50 rounded-xl p-4">
              <p className="text-xs font-medium text-surface-500 mb-3 uppercase tracking-wider">Nutrition ({servings} serving{servings !== 1 ? 's' : ''})</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center">
                  <p className="text-lg font-bold text-cal">{Math.round(selectedFood.calories * servings)}</p>
                  <p className="text-xs text-surface-500">Calories</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-protein">{Math.round(selectedFood.protein * servings * 10) / 10}g</p>
                  <p className="text-xs text-surface-500">Protein</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-carbs">{Math.round(selectedFood.carbs * servings * 10) / 10}g</p>
                  <p className="text-xs text-surface-500">Carbs</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-fat">{Math.round(selectedFood.fat * servings * 10) / 10}g</p>
                  <p className="text-xs text-surface-500">Fat</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setSelectedFood(null)}
                className="flex-1 py-3 rounded-xl border border-surface-200 text-surface-600 font-medium text-sm hover:bg-surface-50 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleAdd}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
              >
                Add to {mealOptions.find(m => m.value === meal)?.label}
              </button>
            </div>
          </div>
        ) : (
          /* ─── Food Search ─── */
          <div className="flex flex-col overflow-hidden">
            {/* Search */}
            <div className="p-4 border-b border-surface-100">
              <div className="relative">
                <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400" />
                <input
                  type="text"
                  placeholder="Search foods..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  autoFocus
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-surface-50 border border-surface-200 text-sm text-surface-900 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
              </div>
              <button
                onClick={onCreateCustom}
                className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-primary/40 text-primary-dark text-sm font-medium hover:bg-primary-light transition-colors"
              >
                <Plus size={16} />
                Create Custom Food
              </button>
            </div>

            {/* Food list */}
            <div className="overflow-y-auto flex-1 max-h-[50vh]">
              {filteredFoods.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-surface-400 text-sm">No foods found</p>
                  <p className="text-surface-400 text-xs mt-1">Try a different search or create a custom food</p>
                </div>
              ) : (
                <div className="divide-y divide-surface-100">
                  {filteredFoods.map(food => (
                    <button
                      key={food.id}
                      onClick={() => setSelectedFood(food)}
                      className="w-full flex items-center gap-3 p-4 hover:bg-surface-50 transition-colors text-left"
                    >
                      <div className="w-10 h-10 rounded-xl bg-surface-100 flex items-center justify-center flex-shrink-0">
                        <ChefHat size={18} className="text-surface-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-surface-900 truncate">
                          {food.name}
                          {food.isCustom && (
                            <span className="ml-2 text-[10px] font-semibold bg-primary-light text-primary-dark px-1.5 py-0.5 rounded-md">
                              CUSTOM
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-surface-500">{food.servingSize}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-semibold text-cal">{food.calories} kcal</p>
                        <p className="text-xs text-surface-400">P:{food.protein}g C:{food.carbs}g F:{food.fat}g</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
