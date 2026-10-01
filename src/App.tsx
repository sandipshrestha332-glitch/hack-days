import { useState } from 'react';
import type { Page, Food, MealType } from './types';
import { useStore } from './store';
import { Sidebar, BottomNav } from './components/Navigation';
import { ToastContainer } from './components/Toast';
import { Onboarding } from './pages/Onboarding';
import { Dashboard } from './pages/Dashboard';
import { FoodLog } from './pages/FoodLog';
import { Progress } from './pages/Progress';
import { Settings } from './pages/Settings';
import { getTodayString } from './calculations';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const store = useStore();

  // Not onboarded — show onboarding
  if (!store.state.isOnboarded) {
    return (
      <>
        <Onboarding onComplete={store.completeOnboarding} />
        <ToastContainer toasts={store.toasts} onRemove={store.removeToast} />
      </>
    );
  }

  const profile = store.state.profile!;
  const targets = store.state.targets;
  const todayEntries = store.getTodayEntries();
  const totals = store.getTodayTotals();
  const allFoods = store.getAllFoods();

  const handleAddFood = (food: Food, servings: number, meal: MealType) => {
    store.addFoodEntry({
      foodId: food.id,
      foodName: food.name,
      meal,
      servings,
      calories: Math.round(food.calories * servings),
      protein: Math.round(food.protein * servings * 10) / 10,
      carbs: Math.round(food.carbs * servings * 10) / 10,
      fat: Math.round(food.fat * servings * 10) / 10,
      date: getTodayString(),
    });
  };

  const handleCreateCustomFood = (food: Omit<Food, 'id' | 'isCustom'>) => {
    store.addCustomFood(food);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <Dashboard
            profile={profile}
            targets={targets}
            todayEntries={todayEntries}
            totals={totals}
            allFoods={allFoods}
            onAddFood={handleAddFood}
            onRemoveFood={store.removeFoodEntry}
            onCreateCustomFood={handleCreateCustomFood}
          />
        );
      case 'food-log':
        return (
          <FoodLog
            entries={store.state.foodLog}
            allFoods={allFoods}
            onAddFood={handleAddFood}
            onRemoveFood={store.removeFoodEntry}
            onCreateCustomFood={handleCreateCustomFood}
          />
        );
      case 'progress':
        return (
          <Progress
            profile={profile}
            targets={targets}
            weightHistory={store.state.weightHistory}
            foodLog={store.state.foodLog}
            onAddWeight={store.addWeightEntry}
          />
        );
      case 'settings':
        return (
          <Settings
            profile={profile}
            targets={targets}
            onUpdateProfile={store.updateProfile}
            onUpdateTargets={store.updateTargets}
            onReset={store.resetAllData}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Desktop Sidebar */}
      <Sidebar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        userName={profile.name}
      />

      {/* Main Content */}
      <main className="lg:ml-64 pb-24 lg:pb-8">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
          {renderPage()}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <BottomNav
        currentPage={currentPage}
        onNavigate={setCurrentPage}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={store.toasts} onRemove={store.removeToast} />
    </div>
  );
}
