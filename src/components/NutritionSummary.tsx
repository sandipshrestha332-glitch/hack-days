import type { MacroTargets } from '../types';
import { formatNumber } from '../calculations';
import { CheckCircle, AlertTriangle } from 'lucide-react';

interface NutritionSummaryProps {
  totals: { calories: number; protein: number; carbs: number; fat: number };
  targets: MacroTargets;
}

export function NutritionSummary({ totals, targets }: NutritionSummaryProps) {
  const calPct = targets.calories > 0 ? Math.round((totals.calories / targets.calories) * 100) : 0;
  const proteinPct = targets.protein > 0 ? Math.round((totals.protein / targets.protein) * 100) : 0;
  const carbsPct = targets.carbs > 0 ? Math.round((totals.carbs / targets.carbs) * 100) : 0;
  const fatPct = targets.fat > 0 ? Math.round((totals.fat / targets.fat) * 100) : 0;

  // Simple status messages
  const messages: string[] = [];
  const isOnTrack = calPct >= 70 && calPct <= 110;

  if (calPct < 50) {
    messages.push(`You've consumed only ${calPct}% of your calorie target.`);
  }
  if (proteinPct < 70) {
    const remaining = Math.round(targets.protein - totals.protein);
    messages.push(`Protein is ${remaining}g below your target.`);
  }
  if (carbsPct > 110) {
    messages.push(`Carbs are above your target.`);
  }
  if (fatPct > 110) {
    messages.push(`Fat intake is above your target.`);
  }

  return (
    <div className="bg-white rounded-2xl border border-surface-200/60 shadow-sm p-5">
      <h3 className="font-semibold text-surface-900 mb-4">Daily Summary</h3>

      {/* Status */}
      <div className={`flex items-center gap-3 p-3 rounded-xl mb-4 ${
        isOnTrack ? 'bg-primary-light' : 'bg-amber-50'
      }`}>
        {isOnTrack ? (
          <CheckCircle size={20} className="text-primary flex-shrink-0" />
        ) : (
          <AlertTriangle size={20} className="text-amber-500 flex-shrink-0" />
        )}
        <p className={`text-sm font-medium ${isOnTrack ? 'text-primary-darker' : 'text-amber-700'}`}>
          {isOnTrack ? "You're on track today! 💪" : messages[0] || "Keep going!"}
        </p>
      </div>

      {/* Summary grid */}
      <div className="grid grid-cols-2 gap-3">
        <SummaryItem label="Calories" value={formatNumber(Math.round(totals.calories))} unit="kcal" pct={calPct} color="#f97316" />
        <SummaryItem label="Protein" value={`${Math.round(totals.protein)}`} unit="g" pct={proteinPct} color="#3b82f6" />
        <SummaryItem label="Carbs" value={`${Math.round(totals.carbs)}`} unit="g" pct={carbsPct} color="#8b5cf6" />
        <SummaryItem label="Fat" value={`${Math.round(totals.fat)}`} unit="g" pct={fatPct} color="#eab308" />
      </div>

      {/* Additional messages */}
      {messages.length > 1 && (
        <div className="mt-4 space-y-1.5">
          {messages.slice(1).map((msg, i) => (
            <p key={i} className="text-xs text-surface-500 flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-surface-300 flex-shrink-0" />
              {msg}
            </p>
          ))}
        </div>
      )}

      <p className="text-[10px] text-surface-300 mt-4 italic">
        * These are estimated values and not medical advice.
      </p>
    </div>
  );
}

function SummaryItem({ label, value, unit, pct, color }: { label: string; value: string; unit: string; pct: number; color: string }) {
  return (
    <div className="bg-surface-50 rounded-xl p-3 text-center">
      <p className="text-xs text-surface-500 mb-1">{label}</p>
      <p className="text-lg font-bold text-surface-900">
        {value}
        <span className="text-xs font-normal text-surface-400 ml-0.5">{unit}</span>
      </p>
      <div className="mt-1.5 h-1 rounded-full bg-surface-200 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: color }}
        />
      </div>
      <p className="text-[10px] text-surface-400 mt-1">{pct}% of target</p>
    </div>
  );
}
