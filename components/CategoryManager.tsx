
import React, { useState } from 'react';
import { Category, TransactionType } from '../types';
import { CATEGORY_ICONS } from '../constants';

interface CategoryManagerProps {
  onClose: () => void;
  categories: Category[];
  onAdd: (cat: Omit<Category, 'id'>) => void;
  onDelete: (id: string) => void;
  onReorder?: (categories: Category[]) => void;
}

const CategoryManager: React.FC<CategoryManagerProps> = ({ onClose, categories, onAdd, onDelete, onReorder }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<TransactionType>('expense');
  const [selectedIcon, setSelectedIcon] = useState(CATEGORY_ICONS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    onAdd({ name, type, icon: selectedIcon });
    setName('');
  };

  const moveCategory = (index: number, direction: 'up' | 'down') => {
    if (!onReorder) return;
    const newCategories = [...categories];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= newCategories.length) return;

    const temp = newCategories[index];
    newCategories[index] = newCategories[targetIndex];
    newCategories[targetIndex] = temp;
    
    onReorder(newCategories);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white">Custom Categories</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800">
          <div className="p-6">
            <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Add New</h4>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setType('income')}
                  className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                    type === 'income' ? 'bg-indigo-600 text-white' : 'text-slate-500'
                  }`}
                >
                  Income
                </button>
                <button
                  type="button"
                  onClick={() => setType('expense')}
                  className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                    type === 'expense' ? 'bg-indigo-600 text-white' : 'text-slate-500'
                  }`}
                >
                  Expense
                </button>
              </div>

              <input
                type="text"
                placeholder="Category Name"
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <div>
                <p className="text-xs font-medium text-slate-500 mb-2">Select Icon</p>
                <div className="grid grid-cols-5 gap-2 h-32 overflow-y-auto p-1 custom-scrollbar">
                  {CATEGORY_ICONS.map(icon => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setSelectedIcon(icon)}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                        selectedIcon === icon 
                        ? 'bg-indigo-600 text-white scale-110 shadow-lg' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      <i className={`fas ${icon}`}></i>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-slate-800 dark:bg-indigo-600 text-white font-bold py-3 rounded-xl transition-all active:scale-[0.98]"
              >
                Create Category
              </button>
            </form>
          </div>

          <div className="p-6 bg-slate-50/50 dark:bg-slate-900/50">
            <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Your Categories</h4>
            <div className="space-y-2 h-[340px] overflow-y-auto pr-2 custom-scrollbar">
              {categories.map((cat, index) => (
                <div key={cat.id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                      <i className={`fas ${cat.icon} text-xs`}></i>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{cat.name}</p>
                      <p className="text-[10px] uppercase text-slate-400 font-bold">{cat.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        disabled={index === 0}
                        onClick={() => moveCategory(index, 'up')}
                        className="p-1 text-slate-400 hover:text-indigo-500 disabled:opacity-30"
                      >
                        <i className="fas fa-chevron-up text-[10px]"></i>
                      </button>
                      <button 
                        disabled={index === categories.length - 1}
                        onClick={() => moveCategory(index, 'down')}
                        className="p-1 text-slate-400 hover:text-indigo-500 disabled:opacity-30"
                      >
                        <i className="fas fa-chevron-down text-[10px]"></i>
                      </button>
                    </div>
                    <button 
                      onClick={() => onDelete(cat.id)}
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                    >
                      <i className="fas fa-trash-alt text-sm"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryManager;
