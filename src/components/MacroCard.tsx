import { ProgressRing } from './ProgressRing';
import { formatNumber } from '../calculations';

interface MacroCardProps {
  label: string;
  current: number;
  target: number;
  unit: string;
  color: string;
  bgColor: string;
  lightBg: string;
  icon: React.ReactNode;
}

export function MacroCard({ label, current, target, unit, color, bgColor, lightBg, icon }: MacroCardProps) {
  const pct = target > 0 ? Math.round((current / target) * 100) : 0;
  const remaining = Math.max(target - current, 0);
  const isOver = current > target;

  return (
    <div
      className="rounded-2xl p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 border border-white/60"
      style={{ backgroundColor: lightBg }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-white"
          style={{ backgroundColor: color }}
        >
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium" style={{ color }}>{label}</p>
          <p className="text-xs text-surface-500">
            {isOver ? 'Over by' : 'Remaining'}: {formatNumber(isOver ? Math.round(current - target) : Math.round(remaining))} {unit}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <ProgressRing
          progress={Math.min(pct, 100)}
          size={76}
          strokeWidth={6}
          color={color}
          bgColor={bgColor}
        >
          <span className="text-sm font-bold" style={{ color }}>
            {pct}%
          </span>
        </ProgressRing>

        <div className="flex-1 min-w-0">
          <p className="text-2xl font-bold text-surface-900 leading-tight">
            {formatNumber(Math.round(current))}
          </p>
          <p className="text-sm text-surface-500">
            / {formatNumber(target)} {unit}
          </p>
          {/* Mini progress bar */}
          <div className="mt-2 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: bgColor }}>
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${Math.min(pct, 100)}%`,
                backgroundColor: color,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
