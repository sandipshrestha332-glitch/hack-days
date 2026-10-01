interface MacroChartProps {
  protein: number;
  carbs: number;
  fat: number;
  proteinTarget: number;
  carbsTarget: number;
  fatTarget: number;
}

export function MacroChart({ protein, carbs, fat, proteinTarget, carbsTarget, fatTarget }: MacroChartProps) {
  const total = protein * 4 + carbs * 4 + fat * 9;
  const proteinCal = protein * 4;
  const carbsCal = carbs * 4;
  const fatCal = fat * 9;

  const proteinPct = total > 0 ? (proteinCal / total) * 100 : 33.3;
  const carbsPct = total > 0 ? (carbsCal / total) * 100 : 33.3;
  const fatPct = total > 0 ? (fatCal / total) * 100 : 33.4;

  // SVG donut chart
  const size = 160;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const proteinDash = (proteinPct / 100) * circumference;
  const carbsDash = (carbsPct / 100) * circumference;
  const fatDash = (fatPct / 100) * circumference;

  const proteinOffset = 0;
  const carbsOffset = proteinDash;
  const fatOffset = proteinDash + carbsDash;

  return (
    <div className="bg-white rounded-2xl border border-surface-200/60 shadow-sm p-5">
      <h3 className="font-semibold text-surface-900 mb-4">Macro Breakdown</h3>

      <div className="flex items-center gap-6">
        {/* Donut Chart */}
        <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
          <svg width={size} height={size} className="transform -rotate-90">
            {/* Background */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="#e2e8f0"
              strokeWidth={strokeWidth}
            />
            {total > 0 && (
              <>
                {/* Protein */}
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${proteinDash} ${circumference - proteinDash}`}
                  strokeDashoffset={-proteinOffset}
                  className="transition-all duration-700"
                />
                {/* Carbs */}
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  stroke="#8b5cf6"
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${carbsDash} ${circumference - carbsDash}`}
                  strokeDashoffset={-carbsOffset}
                  className="transition-all duration-700"
                />
                {/* Fat */}
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  stroke="#eab308"
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${fatDash} ${circumference - fatDash}`}
                  strokeDashoffset={-fatOffset}
                  className="transition-all duration-700"
                />
              </>
            )}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-2xl font-bold text-surface-900">{Math.round(total)}</p>
            <p className="text-xs text-surface-400">kcal</p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-protein" />
                <span className="text-sm text-surface-700">Protein</span>
              </div>
              <span className="text-sm font-semibold text-surface-900">{Math.round(proteinPct)}%</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-surface-400">
              <span>{Math.round(protein)}g / {proteinTarget}g</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-carbs" />
                <span className="text-sm text-surface-700">Carbs</span>
              </div>
              <span className="text-sm font-semibold text-surface-900">{Math.round(carbsPct)}%</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-surface-400">
              <span>{Math.round(carbs)}g / {carbsTarget}g</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-fat" />
                <span className="text-sm text-surface-700">Fat</span>
              </div>
              <span className="text-sm font-semibold text-surface-900">{Math.round(fatPct)}%</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-surface-400">
              <span>{Math.round(fat)}g / {fatTarget}g</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
