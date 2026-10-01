import { useState, useEffect, useCallback } from 'react';
import type { AppState, UserProfile, MacroTargets, Food, FoodLogEntry, WeightEntry, Toast } from './types';
import { getTodayString, generateId } from './calculations';
import { FOOD_DATABASE } from './foodDatabase';

const STORAGE_KEY = 'nutriflow_data';

const DEFAULT_STATE: AppState = {
  profile: null,
  targets: { calories: 2200, protein: 160, carbs: 240, fat: 70 },
  customFoods: [],
  foodLog: [],
  weightHistory: [],
  isOnboarded: false,
};

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw) as AppState;
    }
  } catch {
    // ignore
  }
  return DEFAULT_STATE;
}

function saveState(state: AppState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// ─── Demo Data ────────────────────────────────────
function createDemoData(targets: MacroTargets): Partial<AppState> {
  const today = getTodayString();
  const foods = FOOD_DATABASE;

  const findFood = (id: string) => foods.find(f => f.id === id)!;

  const makeEntry = (foodId: string, meal: FoodLogEntry['meal'], servings: number): FoodLogEntry => {
    const food = findFood(foodId);
    return {
      id: generateId(),
      foodId: food.id,
      foodName: food.name,
      meal,
      servings,
      calories: Math.round(food.calories * servings),
      protein: Math.round(food.protein * servings * 10) / 10,
      carbs: Math.round(food.carbs * servings * 10) / 10,
      fat: Math.round(food.fat * servings * 10) / 10,
      date: today,
      timestamp: Date.now() - Math.random() * 86400000,
    };
  };

  const foodLog: FoodLogEntry[] = [
    makeEntry('oats', 'breakfast', 1),
    makeEntry('banana', 'breakfast', 1),
    makeEntry('greek-yogurt', 'breakfast', 1),
    makeEntry('chicken-breast', 'lunch', 1.5),
    makeEntry('white-rice', 'lunch', 1),
    makeEntry('mixed-vegetables', 'lunch', 1),
    makeEntry('apple', 'snacks', 1),
    makeEntry('peanut-butter', 'snacks', 1),
    makeEntry('salmon', 'dinner', 1.5),
    makeEntry('brown-rice', 'dinner', 1),
    makeEntry('broccoli', 'dinner', 1),
  ];

  // Mock weight history (last 14 days)
  const weightHistory: WeightEntry[] = [];
  const baseWeight = 78;
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    weightHistory.push({
      date: d.toISOString().split('T')[0],
      weight: Math.round((baseWeight - i * 0.07 + Math.random() * 0.6 - 0.3) * 10) / 10,
    });
  }

  return { foodLog, weightHistory };
}

// ─── Hook ─────────────────────────────────────────
export function useStore() {
  const [state, setState] = useState<AppState>(loadState);
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const addToast = useCallback((message: string, type: Toast['type'] = 'success') => {
    const id = generateId();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const completeOnboarding = useCallback((profile: UserProfile, targets: MacroTargets) => {
    const demo = createDemoData(targets);
    setState(prev => ({
      ...prev,
      profile,
      targets,
      isOnboarded: true,
      foodLog: demo.foodLog ?? prev.foodLog,
      weightHistory: demo.weightHistory ?? prev.weightHistory,
    }));
    addToast(`Welcome, ${profile.name}! Your nutrition targets are set.`);
  }, [addToast]);

  const updateProfile = useCallback((profile: UserProfile) => {
    setState(prev => ({ ...prev, profile }));
    addToast('Profile updated successfully');
  }, [addToast]);

  const updateTargets = useCallback((targets: MacroTargets) => {
    setState(prev => ({ ...prev, targets }));
    addToast('Nutrition targets updated');
  }, [addToast]);

  const addFoodEntry = useCallback((entry: Omit<FoodLogEntry, 'id' | 'timestamp'>) => {
    const newEntry: FoodLogEntry = {
      ...entry,
      id: generateId(),
      timestamp: Date.now(),
    };
    setState(prev => ({
      ...prev,
      foodLog: [...prev.foodLog, newEntry],
    }));
    addToast(`${entry.foodName} added to ${entry.meal}`);
  }, [addToast]);

  const removeFoodEntry = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      foodLog: prev.foodLog.filter(e => e.id !== id),
    }));
    addToast('Food entry removed');
  }, [addToast]);

  const addCustomFood = useCallback((food: Omit<Food, 'id' | 'isCustom'>) => {
    const newFood: Food = {
      ...food,
      id: `custom-${generateId()}`,
      isCustom: true,
    };
    setState(prev => ({
      ...prev,
      customFoods: [...prev.customFoods, newFood],
    }));
    addToast(`${food.name} added to your foods`);
    return newFood;
  }, [addToast]);

  const addWeightEntry = useCallback((entry: WeightEntry) => {
    setState(prev => {
      const filtered = prev.weightHistory.filter(w => w.date !== entry.date);
      return {
        ...prev,
        weightHistory: [...filtered, entry].sort((a, b) => a.date.localeCompare(b.date)),
      };
    });
    addToast('Weight logged');
  }, [addToast]);

  const resetAllData = useCallback(() => {
    setState(DEFAULT_STATE);
    addToast('All data has been reset', 'info');
  }, [addToast]);

  const getAllFoods = useCallback((): Food[] => {
    return [...FOOD_DATABASE, ...state.customFoods];
  }, [state.customFoods]);

  const getTodayEntries = useCallback((): FoodLogEntry[] => {
    const today = getTodayString();
    return state.foodLog.filter(e => e.date === today);
  }, [state.foodLog]);

  const getTodayTotals = useCallback(() => {
    const entries = getTodayEntries();
    return {
      calories: entries.reduce((sum, e) => sum + e.calories, 0),
      protein: Math.round(entries.reduce((sum, e) => sum + e.protein, 0) * 10) / 10,
      carbs: Math.round(entries.reduce((sum, e) => sum + e.carbs, 0) * 10) / 10,
      fat: Math.round(entries.reduce((sum, e) => sum + e.fat, 0) * 10) / 10,
    };
  }, [getTodayEntries]);

  return {
    state,
    toasts,
    addToast,
    removeToast,
    completeOnboarding,
    updateProfile,
    updateTargets,
    addFoodEntry,
    removeFoodEntry,
    addCustomFood,
    addWeightEntry,
    resetAllData,
    getAllFoods,
    getTodayEntries,
    getTodayTotals,
  };
}
