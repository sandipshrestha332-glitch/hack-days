import { useState } from 'react';
import { TrendingDown, TrendingUp, Minus, Scale, Target, ArrowDown, ArrowUp } from 'lucide-react';
import type { WeightEntry, UserProfile, MacroTargets, FoodLogEntry } from '../types';
import { formatNumber, getTodayString } from '../calculations';

interface ProgressProps {
  profile: UserProfile;
  targets: MacroTargets;
  weightHistory: WeightEntry[];
  foodLog: FoodLogEntry[];
  onAddWeight: (entry: WeightEntry) => void;
}

export function Progress({ profile, targets, weightHistory, foodLog, onAddWeight }: ProgressProps) {
  const [newWeight, setNewWeight] = useState('');
  const today = getTodayString();

  const currentWeight = weightHistory.length > 0 ? weightHistory[weightHistory.length - 1].weight : profile.weightKg;
  const startWeight = profile.startingWeightKg;
  const goalWeight = profile.goalWeightKg;
  const weightChange = Math.round((currentWeight - startWeight) * 10) / 10;

  const handleLogWeight = () => {
    const w = parseFloat(newWeight);
    if (w && w > 0) {
      onAddWeight({ date: today, weight: w });
      setNewWeight('');
    }
  };

  // Weekly calorie consistency (last 7 days)
  const weeklyData: { day: string; calories: number; pct: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' });
    const dayCal = foodLog
      .filter(e => e.date === dateStr)
      .reduce((s, e) => s + e.calories, 0);
    weeklyData.push({
      day: dayLabel,
      calories: dayCal,
      pct: targets.calories > 0 ? Math.round((dayCal / targets.calories) * 100) : 0,
    });
  }

  const maxCal = Math.max(...weeklyData.map(d => d.calories), targets.calories);

  // Weight chart
  const recentWeights = weightHistory.slice(-14);
  const minWeight = recentWeights.length > 0 ? Math.min(...recentWeights.map(w => w.weight)) - 1 : 70;
  const maxWeight = recentWeights.length > 0 ? Math.max(...recentWeights.map(w => w.weight)) + 1 : 90;
  const weightRange = maxWeight - minWeight || 1;

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-bold text-surface-900">Progress</h1>
        <p className="text-sm text-surface-500 mt-1">Track your weight and consistency</p>
      </div>

      {/* Weight Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 stagger-children">
        <div className="bg-white rounded-2xl border border-surface-200/60 shadow-sm p-4 text-center">
          <Scale size={20} className="text-primary mx-auto mb-2" />
          <p className="text-xs text-surface-400 mb-1">Current</p>
          <p className="text-xl font-bold text-surface-900">{currentWeight} kg</p>
        </div>
        <div className="bg-white rounded-2xl border border-surface-200/60 shadow-sm p-4 text-center">
          <ArrowDown size={20} className="text-surface-400 mx-auto mb-2" />
          <p className="text-xs text-surface-400 mb-1">Starting</p>
          <p className="text-xl font-bold text-surface-900">{startWeight} kg</p>
        </div>
        <div className="bg-white rounded-2xl border border-surface-200/60 shadow-sm p-4 text-center">
          <Target size={20} className="text-primary mx-auto mb-2" />
          <p className="text-xs text-surface-400 mb-1">Goal</p>
          <p className="text-xl font-bold text-surface-900">{goalWeight} kg</p>
        </div>
        <div className="bg-white rounded-2xl border border-surface-200/60 shadow-sm p-4 text-center">
          {weightChange < 0 ? (
            <TrendingDown size={20} className="text-primary mx-auto mb-2" />
          ) : weightChange > 0 ? (
            <TrendingUp size={20} className="text-cal mx-auto mb-2" />
          ) : (
            <Minus size={20} className="text-surface-400 mx-auto mb-2" />
          )}
          <p className="text-xs text-surface-400 mb-1">Change</p>
          <p className={`text-xl font-bold ${weightChange < 0 ? 'text-primary' : weightChange > 0 ? 'text-cal' : 'text-surface-500'}`}>
            {weightChange > 0 ? '+' : ''}{weightChange} kg
          </p>
        </div>
      </div>

      {/* Log Weight */}
      <div className="bg-white rounded-2xl border border-surface-200/60 shadow-sm p-5">
        <h3 className="font-semibold text-surface-900 mb-3">Log Today's Weight</h3>
        <div className="flex gap-3">
          <input
            type="number"
            value={newWeight}
            onChange={e => setNewWeight(e.target.value)}
            placeholder={`e.g. ${currentWeight}`}
            className="flex-1 px-4 py-2.5 rounded-xl border border-surface-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
          <button
            onClick={handleLogWeight}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white font-medium text-sm shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
          >
            Log
          </button>
        </div>
      </div>

      {/* Weight Chart */}
      {recentWeights.length > 1 && (
        <div className="bg-white rounded-2xl border border-surface-200/60 shadow-sm p-5">
          <h3 className="font-semibold text-surface-900 mb-4">Weight Trend (Last 14 Days)</h3>
          <div className="relative h-48">
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 bottom-6 w-10 flex flex-col justify-between text-xs text-surface-400">
              <span>{maxWeight.toFixed(0)}</span>
              <span>{((maxWeight + minWeight) / 2).toFixed(0)}</span>
              <span>{minWeight.toFixed(0)}</span>
            </div>
            {/* Chart area */}
            <div className="ml-12 h-full relative">
              {/* Grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between pb-6">
                {[0, 1, 2].map(i => (
                  <div key={i} className="border-t border-surface-100 w-full" />
                ))}
              </div>
              {/* SVG line chart */}
              <svg className="w-full h-[calc(100%-24px)]" viewBox={`0 0 ${(recentWeights.length - 1) * 100} 200`} preserveAspectRatio="none">
                {/* Line */}
                <polyline
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  points={recentWeights.map((w, i) => {
                    const x = i * 100;
                    const y = 200 - ((w.weight - minWeight) / weightRange) * 200;
                    return `${x},${y}`;
                  }).join(' ')}
                />
                {/* Area fill */}
                <polygon
                  fill="url(#weightGradient)"
                  opacity="0.15"
                  points={`0,200 ${recentWeights.map((w, i) => {
                    const x = i * 100;
                    const y = 200 - ((w.weight - minWeight) / weightRange) * 200;
                    return `${x},${y}`;
                  }).join(' ')} ${(recentWeights.length - 1) * 100},200`}
                />
                {/* Dots */}
                {recentWeights.map((w, i) => {
                  const x = i * 100;
                  const y = 200 - ((w.weight - minWeight) / weightRange) * 200;
                  return (
                    <circle key={i} cx={x} cy={y} r="5" fill="#10b981" stroke="white" strokeWidth="2" />
                  );
                })}
                <defs>
                  <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
              {/* X-axis labels */}
              <div className="flex justify-between text-xs text-surface-400 mt-1">
                {recentWeights.map((w, i) => (
                  <span key={i} className={i % 3 !== 0 && recentWeights.length > 7 ? 'hidden sm:inline' : ''}>
                    {new Date(w.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Weekly Calorie Chart */}
      <div className="bg-white rounded-2xl border border-surface-200/60 shadow-sm p-5">
        <h3 className="font-semibold text-surface-900 mb-4">Weekly Calorie Consistency</h3>
        <div className="flex items-end gap-2 h-40">
          {weeklyData.map((d, i) => {
            const barHeight = maxCal > 0 ? (d.calories / maxCal) * 100 : 0;
            const isToday = i === weeklyData.length - 1;
            const onTarget = d.pct >= 80 && d.pct <= 110;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <p className="text-[10px] text-surface-400 font-medium">{d.calories > 0 ? d.calories : '-'}</p>
                <div className="w-full rounded-t-lg transition-all duration-500" style={{
                  height: `${Math.max(barHeight, 4)}%`,
                  backgroundColor: isToday ? '#10b981' : onTarget ? '#10b981' : d.calories > 0 ? '#f97316' : '#e2e8f0',
                  opacity: isToday ? 1 : 0.7,
                }} />
                <p className={`text-xs font-medium ${isToday ? 'text-primary-dark' : 'text-surface-400'}`}>{d.day}</p>
              </div>
            );
          })}
        </div>
        <div className="mt-3 flex items-center gap-4 text-xs text-surface-400">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm bg-primary" />
            <span>On target</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm bg-cal" />
            <span>Off target</span>
          </div>
          <span className="ml-auto">Target: {formatNumber(targets.calories)} kcal</span>
        </div>
      </div>
    </div>
  );
}
