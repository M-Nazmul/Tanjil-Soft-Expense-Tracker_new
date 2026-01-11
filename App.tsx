
import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import DashboardCards from './components/DashboardCards';
import Analytics from './components/Analytics';
import TransactionList from './components/TransactionList';
import TransactionForm from './components/TransactionForm';
import CategoryManager from './components/CategoryManager';
import InsightSection from './components/InsightSection';
import { Transaction, Category, TimeFilter } from './types';
import { DEFAULT_CATEGORIES } from './constants';

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : true; // Defaulted to true
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('transactions');
    return saved ? JSON.parse(saved) : [];
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('categories');
    return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
  });

  const [currency, setCurrency] = useState<string>(() => {
    return localStorage.getItem('currency') || 'BDT';
  });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const currencySymbol = useMemo(() => {
    return currency === 'BDT' ? '৳' : '$';
  }, [currency]);

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('currency', currency);
  }, [currency]);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const filteredTransactions = useMemo(() => {
    const now = new Date();
    const todayStr = now.toDateString();
    
    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();

    return transactions.filter(t => {
      const tDate = new Date(t.date);
      const tDateStr = tDate.toDateString();

      let timeMatch = true;
      if (timeFilter === 'today') timeMatch = tDateStr === todayStr;
      else if (timeFilter === 'yesterday') timeMatch = tDateStr === yesterdayStr;
      else if (timeFilter === 'weekly') {
        const weekAgo = new Date();
        weekAgo.setDate(now.getDate() - 7);
        timeMatch = tDate >= weekAgo;
      }
      else if (timeFilter === 'monthly') {
        timeMatch = tDate.getMonth() === now.getMonth() && tDate.getFullYear() === now.getFullYear();
      }

      const categoryMatch = categoryFilter === 'all' || t.category === categoryFilter;

      return timeMatch && categoryMatch;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, timeFilter, categoryFilter]);

  const stats = useMemo(() => {
    const income = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    return {
      totalIncome: income,
      totalExpense: expense,
      netBalance: income - expense,
    };
  }, [filteredTransactions]);

  const handleTransactionSubmit = (data: Omit<Transaction, 'id'>) => {
    if (editingTransaction) {
      // Update existing
      setTransactions(prev => prev.map(t => t.id === editingTransaction.id ? { ...data, id: t.id } : t));
    } else {
      // Create new
      const transaction: Transaction = {
        ...data,
        id: crypto.randomUUID(),
      };
      setTransactions(prev => [...prev, transaction]);
    }
    handleCloseForm();
  };

  const handleEditClick = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTransaction(null);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const handleAddCategory = (cat: Omit<Category, 'id'>) => {
    const newCat: Category = { ...cat, id: crypto.randomUUID() };
    setCategories(prev => [...prev, newCat]);
  };

  const handleReorderCategories = (newCategories: Category[]) => {
    setCategories(newCategories);
  };

  return (
    <div className="min-h-screen pb-12 transition-colors duration-300">
      <Header 
        darkMode={darkMode} 
        setDarkMode={setDarkMode} 
        onAddClick={() => setIsFormOpen(true)}
        onCategoryClick={() => setIsCategoryOpen(true)}
        currency={currency}
        setCurrency={setCurrency}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <DashboardCards stats={stats} currencySymbol={currencySymbol} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2 space-y-8">
            <Analytics transactions={filteredTransactions} categories={categories} currencySymbol={currencySymbol} />
            <TransactionList 
              transactions={filteredTransactions} 
              onDelete={handleDeleteTransaction}
              onEdit={handleEditClick}
              timeFilter={timeFilter}
              setTimeFilter={setTimeFilter}
              categories={categories}
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
              filteredStats={stats}
              currencySymbol={currencySymbol}
            />
          </div>
          
          <div className="space-y-8">
            <InsightSection transactions={transactions} />
            <div className="glass-card p-6 rounded-2xl shadow-xl">
              <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-white">Recent Activity</h3>
              <div className="space-y-4">
                {transactions.slice(0, 5).map(t => (
                  <div key={t.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${t.type === 'income' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                      <div>
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{t.title}</p>
                        <p className="text-xs text-slate-500">{new Date(t.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <p className={`text-sm font-bold ${t.type === 'income' ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {t.type === 'income' ? '+' : '-'}{currencySymbol}{t.amount.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {isFormOpen && (
        <TransactionForm 
          onClose={handleCloseForm} 
          onSubmit={handleTransactionSubmit}
          categories={categories}
          currencySymbol={currencySymbol}
          initialData={editingTransaction}
        />
      )}

      {isCategoryOpen && (
        <CategoryManager 
          onClose={() => setIsCategoryOpen(false)}
          categories={categories}
          onAdd={handleAddCategory}
          onDelete={(id) => setCategories(prev => prev.filter(c => c.id !== id))}
          onReorder={handleReorderCategories}
        />
      )}
    </div>
  );
};

export default App;
