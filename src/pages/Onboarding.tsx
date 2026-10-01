import { useState } from 'react';
import { ArrowRight, ArrowLeft, Sparkles, User, Ruler, Activity, Target } from 'lucide-react';
import type { UserProfile, ActivityLevel, Goal, Sex, MacroTargets } from '../types';
import { calculateMacroTargets, calculateCalorieTarget, calculateTDEE, getActivityLabel, getGoalLabel, formatNumber } from '../calculations';

interface OnboardingProps {
  onComplete: (profile: UserProfile, targets: MacroTargets) => void;
}

const STEPS = ['Welcome', 'Personal', 'Body', 'Activity', 'Goals', 'Review'] as const;

export function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [age, setAge] = useState('25');
  const [sex, setSex] = useState<Sex>('male');
  const [heightCm, setHeightCm] = useState('175');
  const [weightKg, setWeightKg] = useState('78');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('moderate');
  const [goal, setGoal] = useState<Goal>('maintain');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Editable targets
  const [customTargets, setCustomTargets] = useState<MacroTargets | null>(null);

  const profile: UserProfile = {
    name: name.trim() || 'User',
    age: parseInt(age) || 25,
    sex,
    heightCm: parseFloat(heightCm) || 175,
    weightKg: parseFloat(weightKg) || 78,
    activityLevel,
    goal,
    startingWeightKg: parseFloat(weightKg) || 78,
    goalWeightKg: goal === 'lose' ? (parseFloat(weightKg) || 78) - 5 : goal === 'gain' ? (parseFloat(weightKg) || 78) + 5 : parseFloat(weightKg) || 78,
  };

  const suggestedTargets = calculateMacroTargets(profile);
  const targets = customTargets || suggestedTargets;
  const tdee = calculateTDEE(profile);

  const validate = (s: number): boolean => {
    const errs: Record<string, string> = {};
    if (s === 1) {
      if (!name.trim()) errs.name = 'Please enter your name';
      if (!age || parseInt(age) < 10 || parseInt(age) > 120) errs.age = 'Enter a valid age';
    }
    if (s === 2) {
      if (!heightCm || parseFloat(heightCm) < 50 || parseFloat(heightCm) > 300) errs.height = 'Enter a valid height';
      if (!weightKg || parseFloat(weightKg) < 20 || parseFloat(weightKg) > 500) errs.weight = 'Enter a valid weight';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const next = () => {
    if (!validate(step)) return;
    if (step === 4) {
      // Calculate initial targets when entering review
      setCustomTargets(suggestedTargets);
    }
    setStep(s => Math.min(s + 1, STEPS.length - 1));
  };

  const prev = () => setStep(s => Math.max(s - 1, 0));

  const handleComplete = () => {
    onComplete(profile, targets);
  };

  const inputClass = (field: string) =>
    `w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary ${
      errors[field] ? 'border-danger bg-danger-light' : 'border-surface-200 bg-white'
    }`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 via-primary-light to-surface-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg animate-fade-in-up">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-surface-400">Step {step + 1} of {STEPS.length}</span>
            <span className="text-xs font-medium text-primary">{STEPS[step]}</span>
          </div>
          <div className="h-1.5 bg-surface-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-primary-dark rounded-full transition-all duration-500"
              style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-surface-200/50 overflow-hidden">
          <div className="p-8">
            {/* Step 0: Welcome */}
            {step === 0 && (
              <div className="text-center animate-fade-in-up">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary-dark mx-auto mb-6 flex items-center justify-center shadow-lg shadow-primary/30">
                  <Sparkles size={36} className="text-white" />
                </div>
                <h1 className="text-3xl font-bold text-surface-900 mb-3">Welcome to NutriFlow</h1>
                <p className="text-surface-500 leading-relaxed max-w-sm mx-auto">
                  Let's set up your personalized nutrition targets in just a few steps. It takes less than a minute.
                </p>
              </div>
            )}

            {/* Step 1: Personal Info */}
            {step === 1 && (
              <div className="space-y-5 animate-fade-in-up">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center">
                    <User size={20} className="text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-surface-900">About You</h2>
                    <p className="text-sm text-surface-400">Basic information to personalize your plan</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1.5">Name</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" className={inputClass('name')} />
                  {errors.name && <p className="text-xs text-danger mt-1">{errors.name}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-1.5">Age</label>
                    <input type="number" value={age} onChange={e => setAge(e.target.value)} placeholder="25" className={inputClass('age')} />
                    {errors.age && <p className="text-xs text-danger mt-1">{errors.age}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-1.5">Sex</label>
                    <div className="grid grid-cols-2 gap-2">
                      {(['male', 'female'] as Sex[]).map(s => (
                        <button
                          key={s}
                          onClick={() => setSex(s)}
                          className={`py-3 rounded-xl text-sm font-medium border transition-all ${
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
              </div>
            )}

            {/* Step 2: Body */}
            {step === 2 && (
              <div className="space-y-5 animate-fade-in-up">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center">
                    <Ruler size={20} className="text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-surface-900">Body Measurements</h2>
                    <p className="text-sm text-surface-400">Used to calculate your calorie needs</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1.5">Height (cm)</label>
                  <input type="number" value={heightCm} onChange={e => setHeightCm(e.target.value)} placeholder="175" className={inputClass('height')} />
                  {errors.height && <p className="text-xs text-danger mt-1">{errors.height}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1.5">Weight (kg)</label>
                  <input type="number" value={weightKg} onChange={e => setWeightKg(e.target.value)} placeholder="78" className={inputClass('weight')} />
                  {errors.weight && <p className="text-xs text-danger mt-1">{errors.weight}</p>}
                </div>
              </div>
            )}

            {/* Step 3: Activity */}
            {step === 3 && (
              <div className="space-y-4 animate-fade-in-up">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center">
                    <Activity size={20} className="text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-surface-900">Activity Level</h2>
                    <p className="text-sm text-surface-400">How active are you on average?</p>
                  </div>
                </div>

                {(['sedentary', 'light', 'moderate', 'active', 'very_active'] as ActivityLevel[]).map(level => (
                  <button
                    key={level}
                    onClick={() => setActivityLevel(level)}
                    className={`w-full text-left px-4 py-3.5 rounded-xl border transition-all ${
                      activityLevel === level
                        ? 'bg-primary-light border-primary shadow-sm'
                        : 'border-surface-200 hover:bg-surface-50'
                    }`}
                  >
                    <p className={`text-sm font-medium ${activityLevel === level ? 'text-primary-dark' : 'text-surface-700'}`}>
                      {getActivityLabel(level)}
                    </p>
                  </button>
                ))}
              </div>
            )}

            {/* Step 4: Goal */}
            {step === 4 && (
              <div className="space-y-4 animate-fade-in-up">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center">
                    <Target size={20} className="text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-surface-900">Your Goal</h2>
                    <p className="text-sm text-surface-400">What do you want to achieve?</p>
                  </div>
                </div>

                {(['lose', 'maintain', 'gain'] as Goal[]).map(g => {
                  const icons = { lose: '📉', maintain: '⚖️', gain: '📈' };
                  const descriptions = {
                    lose: 'Calorie deficit to gradually reduce weight',
                    maintain: 'Balanced intake to maintain your current weight',
                    gain: 'Calorie surplus to build mass',
                  };
                  return (
                    <button
                      key={g}
                      onClick={() => setGoal(g)}
                      className={`w-full text-left px-4 py-4 rounded-xl border transition-all ${
                        goal === g
                          ? 'bg-primary-light border-primary shadow-sm'
                          : 'border-surface-200 hover:bg-surface-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{icons[g]}</span>
                        <div>
                          <p className={`text-sm font-semibold ${goal === g ? 'text-primary-dark' : 'text-surface-700'}`}>
                            {getGoalLabel(g)}
                          </p>
                          <p className="text-xs text-surface-400 mt-0.5">{descriptions[g]}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Step 5: Review */}
            {step === 5 && (
              <div className="space-y-5 animate-fade-in-up">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-surface-900">Your Nutrition Targets</h2>
                  <p className="text-sm text-surface-400 mt-1">Based on your profile. You can adjust these anytime.</p>
                </div>

                {/* TDEE info */}
                <div className="bg-surface-50 rounded-xl p-4 text-center">
                  <p className="text-xs text-surface-400 uppercase tracking-wider mb-1">Estimated TDEE</p>
                  <p className="text-2xl font-bold text-surface-900">{formatNumber(tdee)} <span className="text-sm font-normal text-surface-400">kcal/day</span></p>
                </div>

                {/* Editable targets */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-cal-light rounded-xl p-4 text-center">
                    <p className="text-xs font-medium text-cal-dark mb-2">Calories (kcal)</p>
                    <input
                      type="number"
                      value={targets.calories}
                      onChange={e => setCustomTargets(t => ({ ...(t || suggestedTargets), calories: parseInt(e.target.value) || 0 }))}
                      className="w-full text-center text-xl font-bold text-cal bg-transparent border-none focus:outline-none"
                    />
                  </div>
                  <div className="bg-protein-light rounded-xl p-4 text-center">
                    <p className="text-xs font-medium text-protein-dark mb-2">Protein (g)</p>
                    <input
                      type="number"
                      value={targets.protein}
                      onChange={e => setCustomTargets(t => ({ ...(t || suggestedTargets), protein: parseInt(e.target.value) || 0 }))}
                      className="w-full text-center text-xl font-bold text-protein bg-transparent border-none focus:outline-none"
                    />
                  </div>
                  <div className="bg-carbs-light rounded-xl p-4 text-center">
                    <p className="text-xs font-medium text-carbs-dark mb-2">Carbs (g)</p>
                    <input
                      type="number"
                      value={targets.carbs}
                      onChange={e => setCustomTargets(t => ({ ...(t || suggestedTargets), carbs: parseInt(e.target.value) || 0 }))}
                      className="w-full text-center text-xl font-bold text-carbs bg-transparent border-none focus:outline-none"
                    />
                  </div>
                  <div className="bg-fat-light rounded-xl p-4 text-center">
                    <p className="text-xs font-medium text-fat-dark mb-2">Fat (g)</p>
                    <input
                      type="number"
                      value={targets.fat}
                      onChange={e => setCustomTargets(t => ({ ...(t || suggestedTargets), fat: parseInt(e.target.value) || 0 }))}
                      className="w-full text-center text-xl font-bold text-fat bg-transparent border-none focus:outline-none"
                    />
                  </div>
                </div>

                <p className="text-[11px] text-surface-400 text-center italic">
                  ⚠️ These are estimates based on standard formulas. They are not medical advice. Consult a healthcare professional for personalized guidance.
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-8 pb-8 flex gap-3">
            {step > 0 && (
              <button
                onClick={prev}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-surface-200 text-surface-600 font-medium text-sm hover:bg-surface-50 transition-colors"
              >
                <ArrowLeft size={16} />
                Back
              </button>
            )}
            <button
              onClick={step === STEPS.length - 1 ? handleComplete : next}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white font-semibold text-sm shadow-lg shadow-primary/30 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 active:translate-y-0"
            >
              {step === STEPS.length - 1 ? "Let's Go! 🚀" : 'Continue'}
              {step < STEPS.length - 1 && <ArrowRight size={16} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
