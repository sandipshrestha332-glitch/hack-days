import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import type { Toast as ToastType } from '../types';

interface ToastContainerProps {
  toasts: ToastType[];
  onRemove: (id: string) => void;
}

const icons = {
  success: <CheckCircle size={18} />,
  error: <AlertCircle size={18} />,
  info: <Info size={18} />,
};

const colors = {
  success: { bg: '#ecfdf5', border: '#10b981', text: '#065f46', icon: '#10b981' },
  error: { bg: '#fef2f2', border: '#ef4444', text: '#991b1b', icon: '#ef4444' },
  info: { bg: '#eff6ff', border: '#3b82f6', text: '#1e40af', icon: '#3b82f6' },
};

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
      {toasts.map(toast => {
        const c = colors[toast.type];
        return (
          <div
            key={toast.id}
            className="animate-toast rounded-xl px-4 py-3 shadow-lg flex items-center gap-3 border"
            style={{
              backgroundColor: c.bg,
              borderColor: c.border,
            }}
          >
            <span style={{ color: c.icon }}>{icons[toast.type]}</span>
            <p className="flex-1 text-sm font-medium" style={{ color: c.text }}>
              {toast.message}
            </p>
            <button
              onClick={() => onRemove(toast.id)}
              className="text-surface-400 hover:text-surface-600 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
