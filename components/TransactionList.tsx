
import React from 'react';
import { Transaction, TimeFilter, Category, DashboardStats } from '../types';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  onEdit: (transaction: Transaction) => void;
  timeFilter: TimeFilter;
  setTimeFilter: (filter: TimeFilter) => void;
  categories: Category[];
  categoryFilter: string;
  setCategoryFilter: (val: string) => void;
  filteredStats: DashboardStats;
  currencySymbol: string;
}

const TransactionList: React.FC<TransactionListProps> = ({ 
  transactions, 
  onDelete, 
  onEdit,
  timeFilter, 
  setTimeFilter,
  categories,
  categoryFilter,
  setCategoryFilter,
  filteredStats,
  currencySymbol
}) => {
  const getCategoryIcon = (categoryName: string) => {
    const cat = categories.find(c => c.name === categoryName);
    return cat ? cat.icon : 'fa-tag';
  };

  const filters: { label: string; value: TimeFilter }[] = [
    { label: 'All', value: 'all' },
    { label: 'Today', value: 'today' },
    { label: 'Yesterday', value: 'yesterday' },
    { label: 'Weekly', value: 'weekly' },
    { label: 'Monthly', value: 'monthly' },
  ];

  return (
    <div className="glass-card rounded-2xl shadow-xl overflow-hidden">
      <div className="p-6 border-b border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Transactions</h3>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Time Filters */}
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg overflow-x-auto">
              {filters.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setTimeFilter(f.value)}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
                    timeFilter === f.value 
                      ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-indigo-400' 
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium rounded-lg px-3 py-1.5 outline-none border border-slate-200 dark:border-slate-700 cursor-pointer"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Filtered Totals Summary */}
        <div className="grid grid-cols-3 gap-2 bg-slate-50/50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">Income</p>
            <p className="text-sm font-bold text-emerald-500">{currencySymbol}{filteredStats.totalIncome.toLocaleString()}</p>
          </div>
          <div className="text-center border-x border-slate-200 dark:border-slate-700">
            <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">Expense</p>
            <p className="text-sm font-bold text-rose-500">{currencySymbol}{filteredStats.totalExpense.toLocaleString()}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">Net</p>
            <p className={`text-sm font-bold ${filteredStats.netBalance >= 0 ? 'text-indigo-500' : 'text-rose-600'}`}>
              {currencySymbol}{filteredStats.netBalance.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 dark:bg-slate-900/50 text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">Title & Date</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {transactions.length > 0 ? (
              transactions.map((t) => (
                <tr key={t.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{t.title}</p>
                      <p className="text-xs text-slate-400">{new Date(t.date).toLocaleDateString()}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                        <i className={`fas ${getCategoryIcon(t.category)} text-xs`}></i>
                      </div>
                      <span className="text-sm text-slate-600 dark:text-slate-400">{t.category}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-sm font-bold ${t.type === 'income' ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {t.type === 'income' ? '+' : '-'}{currencySymbol}{t.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button 
                        onClick={() => onEdit(t)}
                        className="opacity-0 group-hover:opacity-100 p-2 text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-all"
                        title="Edit Transaction"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button 
                        onClick={() => onDelete(t.id)}
                        className="opacity-0 group-hover:opacity-100 p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-all"
                        title="Delete Transaction"
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-slate-400 italic">
                  No transactions found for this selection.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionList;
