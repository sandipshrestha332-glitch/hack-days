import { Trash2, Plus } from 'lucide-react';
import type { FoodLogEntry, MealType } from '../types';

interface MealCardProps {
  mealType: MealType;
  entries: FoodLogEntry[];
  onRemove: (id: string) => void;
  onAddFood: (meal: MealType) => void;
}

const mealMeta: Record<MealType, { label: string; emoji: string; gradient: string }> = {
  breakfast: { label: 'Breakfast', emoji: '🌅', gradient: 'from-amber-400 to-orange-500' },
  lunch: { label: 'Lunch', emoji: '☀️', gradient: 'from-sky-400 to-blue-500' },
  dinner: { label: 'Dinner', emoji: '🌙', gradient: 'from-indigo-400 to-purple-500' },
  snacks: { label: 'Snacks', emoji: '🍎', gradient: 'from-emerald-400 to-teal-500' },
};

export function MealCard({ mealType, entries, onRemove, onAddFood }: MealCardProps) {
  const meta = mealMeta[mealType];
  const totalCal = entries.reduce((s, e) => s + e.calories, 0);

  return (
    <div className="bg-white rounded-2xl border border-surface-200/60 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-surface-100">
        <div className="flex items-center gap-3">
          <span className="text-xl">{meta.emoji}</span>
          <div>
            <h3 className="font-semibold text-surface-900">{meta.label}</h3>
            <p className="text-xs text-surface-400">{entries.length} item{entries.length !== 1 ? 's' : ''} · {totalCal} kcal</p>
          </div>
        </div>
        <button
          onClick={() => onAddFood(mealType)}
          className="w-8 h-8 rounded-lg bg-primary-light flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all duration-200"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Entries */}
      {entries.length === 0 ? (
        <div className="px-5 py-6 text-center">
          <p className="text-sm text-surface-400">No foods logged yet</p>
          <button
            onClick={() => onAddFood(mealType)}
            className="mt-2 text-sm text-primary font-medium hover:text-primary-dark transition-colors"
          >
            + Add food
          </button>
        </div>
      ) : (
        <div className="divide-y divide-surface-50">
          {entries.map(entry => (
            <div key={entry.id} className="flex items-center gap-3 px-5 py-3 group hover:bg-surface-50/50 transition-colors">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-surface-800 truncate">{entry.foodName}</p>
                <p className="text-xs text-surface-400">
                  {entry.servings} serving{entry.servings !== 1 ? 's' : ''}
                  <span className="mx-1.5">·</span>
                  <span className="text-cal">{entry.calories} kcal</span>
                  <span className="mx-1.5">·</span>
                  <span className="text-protein">P:{Math.round(entry.protein)}g</span>
                  {' '}
                  <span className="text-carbs">C:{Math.round(entry.carbs)}g</span>
                  {' '}
                  <span className="text-fat">F:{Math.round(entry.fat)}g</span>
                </p>
              </div>
              <button
                onClick={() => onRemove(entry.id)}
                className="opacity-0 group-hover:opacity-100 w-7 h-7 rounded-lg flex items-center justify-center text-surface-300 hover:text-danger hover:bg-danger-light transition-all duration-200 flex-shrink-0"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
