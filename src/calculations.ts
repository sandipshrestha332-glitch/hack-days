import type { UserProfile, MacroTargets, ActivityLevel, Goal } from './types';

// Activity level multipliers for TDEE calculation
const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

// Goal calorie adjustments
const GOAL_ADJUSTMENTS: Record<Goal, number> = {
  lose: -500,
  maintain: 0,
  gain: 300,
};

/**
 * Calculate Basal Metabolic Rate using the Mifflin-St Jeor equation
 * Men: BMR = 10 × weight(kg) + 6.25 × height(cm) – 5 × age(y) + 5
 * Women: BMR = 10 × weight(kg) + 6.25 × height(cm) – 5 × age(y) – 161
 */
export function calculateBMR(profile: UserProfile): number {
  const base = 10 * profile.weightKg + 6.25 * profile.heightCm - 5 * profile.age;
  return profile.sex === 'male' ? base + 5 : base - 161;
}

/**
 * Calculate Total Daily Energy Expenditure
 * TDEE = BMR × activity multiplier
 */
export function calculateTDEE(profile: UserProfile): number {
  const bmr = calculateBMR(profile);
  return Math.round(bmr * ACTIVITY_MULTIPLIERS[profile.activityLevel]);
}

/**
 * Calculate daily calorie target based on goal
 */
export function calculateCalorieTarget(profile: UserProfile): number {
  const tdee = calculateTDEE(profile);
  return Math.round(tdee + GOAL_ADJUSTMENTS[profile.goal]);
}

/**
 * Calculate macro targets based on calorie target
 * Default split:
 * - Protein: 30% of calories (1g = 4 kcal)
 * - Carbs: 40% of calories (1g = 4 kcal)
 * - Fat: 30% of calories (1g = 9 kcal)
 */
export function calculateMacroTargets(profile: UserProfile): MacroTargets {
  const calories = calculateCalorieTarget(profile);

  return {
    calories,
    protein: Math.round((calories * 0.3) / 4),
    carbs: Math.round((calories * 0.4) / 4),
    fat: Math.round((calories * 0.3) / 9),
  };
}

/**
 * Get human-readable activity level label
 */
export function getActivityLabel(level: ActivityLevel): string {
  const labels: Record<ActivityLevel, string> = {
    sedentary: 'Sedentary (little to no exercise)',
    light: 'Lightly Active (1-3 days/week)',
    moderate: 'Moderately Active (3-5 days/week)',
    active: 'Active (6-7 days/week)',
    very_active: 'Very Active (2x/day or physical job)',
  };
  return labels[level];
}

/**
 * Get human-readable goal label
 */
export function getGoalLabel(goal: Goal): string {
  const labels: Record<Goal, string> = {
    lose: 'Lose Weight',
    maintain: 'Maintain Weight',
    gain: 'Gain Weight',
  };
  return labels[goal];
}

/**
 * Format number with locale-specific thousand separator
 */
export function formatNumber(n: number): string {
  return n.toLocaleString('en-US');
}

/**
 * Get today's date string in YYYY-MM-DD format
 */
export function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}
