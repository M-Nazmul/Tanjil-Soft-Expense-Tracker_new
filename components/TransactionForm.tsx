
import React, { useState, useEffect } from 'react';
import { Transaction, Category, TransactionType } from '../types';

interface TransactionFormProps {
  onClose: () => void;
  onSubmit: (data: Omit<Transaction, 'id'>) => void;
  categories: Category[];
  currencySymbol: string;
  initialData?: Transaction | null;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onClose, onSubmit, categories, currencySymbol, initialData }) => {
  const [type, setType] = useState<TransactionType>(initialData?.type || 'expense');
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    amount: initialData?.amount?.toString() || '',
    category: initialData?.category || '',
    date: initialData?.date || new Date().toISOString().split('T')[0],
  });

  // Re-sync if initialData changes (though modal usually remounts)
  useEffect(() => {
    if (initialData) {
      setType(initialData.type);
      setFormData({
        title: initialData.title,
        amount: initialData.amount.toString(),
        category: initialData.category,
        date: initialData.date,
      });
    }
  }, [initialData]);

  const filteredCategories = categories.filter(c => c.type === type);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.amount || !formData.category) return;
    
    onSubmit({
      title: formData.title,
      amount: parseFloat(formData.amount),
      type,
      category: formData.category,
      date: formData.date,
    });
  };

  const isEditing = !!initialData;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-8 border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white">
            {isEditing ? 'Edit Transaction' : 'Add Transaction'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setType('income')}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                type === 'income' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-500'
              }`}
            >
              Income
            </button>
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                type === 'expense' ? 'bg-rose-500 text-white shadow-lg' : 'text-slate-500'
              }`}
            >
              Expense
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Title</label>
            <input
              type="text"
              required
              placeholder="Rent, Groceries, Salary..."
              className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Amount ({currencySymbol})</label>
              <input
                type="number"
                step="0.01"
                required
                placeholder="0.00"
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Date</label>
              <input
                type="date"
                required
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Category</label>
            <select
              required
              className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="">Select category</option>
              {filteredCategories.map(cat => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-500/20 mt-4 transition-all active:scale-[0.98]"
          >
            {isEditing ? 'Update Transaction' : 'Add Transaction'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;
