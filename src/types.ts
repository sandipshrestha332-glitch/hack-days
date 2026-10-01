// ─── User Profile ─────────────────────────────────
export type Sex = 'male' | 'female';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
export type Goal = 'lose' | 'maintain' | 'gain';
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snacks';

export interface UserProfile {
  name: string;
  age: number;
  sex: Sex;
  heightCm: number;
  weightKg: number;
  activityLevel: ActivityLevel;
  goal: Goal;
  startingWeightKg: number;
  goalWeightKg: number;
}

// ─── Nutrition Targets ────────────────────────────
export interface MacroTargets {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

// ─── Foods ────────────────────────────────────────
export interface Food {
  id: string;
  name: string;
  servingSize: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  isCustom?: boolean;
}

// ─── Food Log Entry ───────────────────────────────
export interface FoodLogEntry {
  id: string;
  foodId: string;
  foodName: string;
  meal: MealType;
  servings: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  date: string; // YYYY-MM-DD
  timestamp: number;
}

// ─── Weight Entry ─────────────────────────────────
export interface WeightEntry {
  date: string;
  weight: number;
}

// ─── Daily Summary ────────────────────────────────
export interface DailySummary {
  date: string;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

// ─── App State ────────────────────────────────────
export interface AppState {
  profile: UserProfile | null;
  targets: MacroTargets;
  customFoods: Food[];
  foodLog: FoodLogEntry[];
  weightHistory: WeightEntry[];
  isOnboarded: boolean;
}

// ─── Navigation Page ──────────────────────────────
export type Page = 'dashboard' | 'food-log' | 'progress' | 'settings';

// ─── Toast ────────────────────────────────────────
export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}
