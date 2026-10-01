import { useState } from 'react';
import { Save, RotateCcw, AlertTriangle, User, Target, Activity } from 'lucide-react';
import type { UserProfile, MacroTargets, ActivityLevel, Goal, Sex } from '../types';
import { getActivityLabel, getGoalLabel, calculateMacroTargets } from '../calculations';

interface SettingsProps {
  profile: UserProfile;
  targets: MacroTargets;
  onUpdateProfile: (profile: UserProfile) => void;
  onUpdateTargets: (targets: MacroTargets) => void;
  onReset: () => void;
}

export function Settings({ profile, targets, onUpdateProfile, onUpdateTargets, onReset }: SettingsProps) {
  const [name, setName] = useState(profile.name);
  const [age, setAge] = useState(profile.age.toString());
  const [sex, setSex] = useState<Sex>(profile.sex);
  const [heightCm, setHeightCm] = useState(profile.heightCm.toString());
  const [weightKg, setWeightKg] = useState(profile.weightKg.toString());
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>(profile.activityLevel);
  const [goal, setGoal] = useState<Goal>(profile.goal);

  const [calories, setCalories] = useState(targets.calories.toString());
  const [protein, setProtein] = useState(targets.protein.toString());
  const [carbs, setCarbs] = useState(targets.carbs.toString());
  const [fat, setFat] = useState(targets.fat.toString());

  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSaveProfile = () => {
    const updatedProfile: UserProfile = {
      ...profile,
      name: name.trim() || profile.name,
      age: parseInt(age) || profile.age,
      sex,
      heightCm: parseFloat(heightCm) || profile.heightCm,
      weightKg: parseFloat(weightKg) || profile.weightKg,
      activityLevel,
      goal,
    };
    onUpdateProfile(updatedProfile);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSaveTargets = () => {
    onUpdateTargets({
      calories: parseInt(calories) || targets.calories,
      protein: parseInt(protein) || targets.protein,
      carbs: parseInt(carbs) || targets.carbs,
      fat: parseInt(fat) || targets.fat,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleRecalculate = () => {
    const updatedProfile: UserProfile = {
      ...profile,
      name: name.trim() || profile.name,
      age: parseInt(age) || profile.age,
      sex,
      heightCm: parseFloat(heightCm) || profile.heightCm,
      weightKg: parseFloat(weightKg) || profile.weightKg,
      activityLevel,
      goal,
    };
    const newTargets = calculateMacroTargets(updatedProfile);
    setCalories(newTargets.calories.toString());
    setProtein(newTargets.protein.toString());
    setCarbs(newTargets.carbs.toString());
    setFat(newTargets.fat.toString());
  };

  const inputClass = "w-full px-4 py-2.5 rounded-xl border border-surface-200 bg-white text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary";

  return (
    <div className="space-y-6 animate-fade-in-up max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-surface-900">Settings</h1>
        <p className="text-sm text-surface-500 mt-1">Manage your profile and nutrition targets</p>
      </div>

      {/* Personal Information */}
      <div className="bg-white rounded-2xl border border-surface-200/60 shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-surface-100">
          <User size={20} className="text-primary" />
          <h3 className="font-semibold text-surface-900">Personal Information</h3>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1.5">Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} className={inputClass} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">Age</label>
              <input type="number" value={age} onChange={e => setAge(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">Sex</label>
              <div className="grid grid-cols-2 gap-2">
                {(['male', 'female'] as Sex[]).map(s => (
                  <button
                    key={s}
                    onClick={() => setSex(s)}
                    className={`py-2.5 rounded-xl text-sm font-medium border transition-all ${
                      sex === s
                        ? 'bg-primary-light border-primary text-primary-dark'
                        : 'border-surface-200 text-surface-500 hover:bg-surface-50'
                    }`}
                  >
                    {s === 'male' ? '♂ Male' : '♀ Female'}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">Height (cm)</label>
              <input type="number" value={heightCm} onChange={e => setHeightCm(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">Weight (kg)</label>
              <input type="number" value={weightKg} onChange={e => setWeightKg(e.target.value)} className={inputClass} />
            </div>
          </div>

          <button
            onClick={handleSaveProfile}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
          >
            <Save size={16} />
            Save Profile
          </button>
        </div>
      </div>

      {/* Activity & Goal */}
      <div className="bg-white rounded-2xl border border-surface-200/60 shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-surface-100">
          <Activity size={20} className="text-primary" />
          <h3 className="font-semibold text-surface-900">Activity & Goal</h3>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-2">Activity Level</label>
            <select
              value={activityLevel}
              onChange={e => setActivityLevel(e.target.value as ActivityLevel)}
              className={inputClass}
            >
              {(['sedentary', 'light', 'moderate', 'active', 'very_active'] as ActivityLevel[]).map(level => (
                <option key={level} value={level}>{getActivityLabel(level)}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-surface-700 mb-2">Goal</label>
            <div className="grid grid-cols-3 gap-2">
              {(['lose', 'maintain', 'gain'] as Goal[]).map(g => (
                <button
                  key={g}
                  onClick={() => setGoal(g)}
                  className={`py-2.5 rounded-xl text-sm font-medium border transition-all ${
                    goal === g
                      ? 'bg-primary-light border-primary text-primary-dark'
                      : 'border-surface-200 text-surface-500 hover:bg-surface-50'
                  }`}
                >
                  {getGoalLabel(g)}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => { handleSaveProfile(); handleRecalculate(); }}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
          >
            <Save size={16} />
            Save & Recalculate Targets
          </button>
        </div>
      </div>

      {/* Nutrition Targets */}
      <div className="bg-white rounded-2xl border border-surface-200/60 shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-surface-100">
          <Target size={20} className="text-primary" />
          <h3 className="font-semibold text-surface-900">Daily Nutrition Targets</h3>
        </div>
        <div className="p-5 space-y-4">
          <p className="text-xs text-surface-400 italic">
            ⚠️ These are estimates. Consult a healthcare professional for personalized advice.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-cal-dark mb-1.5">Calories (kcal)</label>
              <input type="number" value={calories} onChange={e => setCalories(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-protein-dark mb-1.5">Protein (g)</label>
              <input type="number" value={protein} onChange={e => setProtein(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-carbs-dark mb-1.5">Carbs (g)</label>
              <input type="number" value={carbs} onChange={e => setCarbs(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-fat-dark mb-1.5">Fat (g)</label>
              <input type="number" value={fat} onChange={e => setFat(e.target.value)} className={inputClass} />
            </div>
          </div>

          <button
            onClick={handleSaveTargets}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
          >
            <Save size={16} />
            Save Targets
          </button>
        </div>
      </div>

      {/* Reset Data */}
      <div className="bg-white rounded-2xl border border-danger/20 shadow-sm overflow-hidden">
        <div className="p-5">
          <h3 className="font-semibold text-danger mb-1">Danger Zone</h3>
          <p className="text-sm text-surface-400 mb-4">This will permanently delete all your data and reset the app.</p>

          {showResetConfirm ? (
            <div className="bg-danger-light rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle size={18} className="text-danger" />
                <p className="text-sm font-medium text-danger">Are you sure? This cannot be undone.</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 py-2 rounded-xl border border-surface-200 text-surface-600 text-sm font-medium hover:bg-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={onReset}
                  className="flex-1 py-2 rounded-xl bg-danger text-white text-sm font-medium hover:bg-red-600 transition-colors"
                >
                  Yes, Reset Everything
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-danger/30 text-danger font-medium text-sm hover:bg-danger-light transition-colors"
            >
              <RotateCcw size={16} />
              Reset All Data
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
