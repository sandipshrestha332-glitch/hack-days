import { LayoutDashboard, UtensilsCrossed, TrendingUp, Settings } from 'lucide-react';
import type { Page } from '../types';

interface NavigationProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  userName?: string;
}

const navItems: { page: Page; label: string; icon: typeof LayoutDashboard }[] = [
  { page: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { page: 'food-log', label: 'Food Log', icon: UtensilsCrossed },
  { page: 'progress', label: 'Progress', icon: TrendingUp },
  { page: 'settings', label: 'Settings', icon: Settings },
];

export function Sidebar({ currentPage, onNavigate, userName }: NavigationProps) {
  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen bg-white border-r border-surface-200 fixed left-0 top-0 z-40">
      {/* Logo */}
      <div className="p-6 border-b border-surface-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-lg">N</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-surface-900 tracking-tight">NutriFlow</h1>
            <p className="text-xs text-surface-400">Smart Nutrition</p>
          </div>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ page, label, icon: Icon }) => {
          const isActive = currentPage === page;
          return (
            <button
              key={page}
              onClick={() => onNavigate(page)}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                transition-all duration-200
                ${isActive
                  ? 'bg-primary-light text-primary-dark shadow-sm'
                  : 'text-surface-500 hover:bg-surface-100 hover:text-surface-700'
                }
              `}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              {label}
            </button>
          );
        })}
      </nav>

      {/* User section */}
      {userName && (
        <div className="p-4 border-t border-surface-100">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-semibold text-sm">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-surface-900 truncate">{userName}</p>
              <p className="text-xs text-surface-400">Free Plan</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

export function BottomNav({ currentPage, onNavigate }: NavigationProps) {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 glass-strong border-t border-surface-200 safe-area-bottom">
      <div className="flex items-center justify-around px-2 py-1">
        {navItems.map(({ page, label, icon: Icon }) => {
          const isActive = currentPage === page;
          return (
            <button
              key={page}
              onClick={() => onNavigate(page)}
              className={`
                flex flex-col items-center gap-0.5 py-2 px-3 rounded-xl transition-all duration-200 min-w-[64px]
                ${isActive
                  ? 'text-primary-dark'
                  : 'text-surface-400 hover:text-surface-600'
                }
              `}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              <span className={`text-[10px] font-medium ${isActive ? 'font-semibold' : ''}`}>
                {label}
              </span>
              {isActive && (
                <div className="w-1 h-1 rounded-full bg-primary mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
