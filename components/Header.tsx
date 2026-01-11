
import React from 'react';

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onAddClick: () => void;
  onCategoryClick: () => void;
  currency: string;
  setCurrency: (val: string) => void;
}

const Header: React.FC<HeaderProps> = ({ darkMode, setDarkMode, onAddClick, onCategoryClick, currency, setCurrency }) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/60 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <i className="fas fa-chart-pie text-white text-xl"></i>
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent hidden sm:block">
            Tanjil Soft
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <select 
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-lg px-2 py-1 outline-none border border-slate-200 dark:border-slate-700 cursor-pointer"
          >
            <option value="USD">USD ($)</option>
            <option value="BDT">BDT (৳)</option>
          </select>

          <button 
            onClick={onCategoryClick}
            className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            title="Manage Categories"
          >
            <i className="fas fa-tags"></i>
          </button>
          
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <i className={`fas ${darkMode ? 'fa-sun' : 'fa-moon'}`}></i>
          </button>

          <button 
            onClick={onAddClick}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
          >
            <i className="fas fa-plus"></i>
            <span className="hidden sm:inline">Add Transaction</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;