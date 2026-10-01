import { useState } from 'react';
import { X } from 'lucide-react';

interface CustomFoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (food: {
    name: string;
    servingSize: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  }) => void;
}

export function CustomFoodModal({ isOpen, onClose, onSave }: CustomFoodModalProps) {
  const [name, setName] = useState('');
  const [servingSize, setServingSize] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Name is required';
    if (!servingSize.trim()) errs.servingSize = 'Serving size is required';
    if (!calories || parseFloat(calories) < 0) errs.calories = 'Enter valid calories';
    if (!protein || parseFloat(protein) < 0) errs.protein = 'Enter valid protein';
    if (!carbs || parseFloat(carbs) < 0) errs.carbs = 'Enter valid carbs';
    if (!fat || parseFloat(fat) < 0) errs.fat = 'Enter valid fat';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave({
      name: name.trim(),
      servingSize: servingSize.trim(),
      calories: parseFloat(calories),
      protein: parseFloat(protein),
      carbs: parseFloat(carbs),
      fat: parseFloat(fat),
    });
    // Reset
    setName('');
    setServingSize('');
    setCalories('');
    setProtein('');
    setCarbs('');
    setFat('');
    setErrors({});
  };

  if (!isOpen) return null;

  const inputClass = (field: string) =>
    `w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary ${
      errors[field] ? 'border-danger bg-danger-light' : 'border-surface-200 bg-white'
    }`;

  return (
    <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in" />
      <div
        className="relative z-10 w-full sm:max-w-md bg-white sm:rounded-2xl rounded-t-2xl shadow-2xl animate-slide-in-up sm:animate-scale-in"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-surface-100">
          <h2 className="text-lg font-bold text-surface-900">Create Custom Food</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-surface-400 hover:bg-surface-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1">Food Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Homemade Granola"
              className={inputClass('name')}
            />
            {errors.name && <p className="text-xs text-danger mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1">Serving Size</label>
            <input
              type="text"
              value={servingSize}
              onChange={e => setServingSize(e.target.value)}
              placeholder="e.g. 1 cup (60g)"
              className={inputClass('servingSize')}
            />
            {errors.servingSize && <p className="text-xs text-danger mt-1">{errors.servingSize}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">Calories (kcal)</label>
              <input type="number" value={calories} onChange={e => setCalories(e.target.value)} placeholder="0" className={inputClass('calories')} />
              {errors.calories && <p className="text-xs text-danger mt-1">{errors.calories}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">Protein (g)</label>
              <input type="number" value={protein} onChange={e => setProtein(e.target.value)} placeholder="0" className={inputClass('protein')} />
              {errors.protein && <p className="text-xs text-danger mt-1">{errors.protein}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">Carbs (g)</label>
              <input type="number" value={carbs} onChange={e => setCarbs(e.target.value)} placeholder="0" className={inputClass('carbs')} />
              {errors.carbs && <p className="text-xs text-danger mt-1">{errors.carbs}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">Fat (g)</label>
              <input type="number" value={fat} onChange={e => setFat(e.target.value)} placeholder="0" className={inputClass('fat')} />
              {errors.fat && <p className="text-xs text-danger mt-1">{errors.fat}</p>}
            </div>
          </div>

          <button
            onClick={handleSave}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 mt-2"
          >
            Save Custom Food
          </button>
        </div>
      </div>
    </div>
  );
}
