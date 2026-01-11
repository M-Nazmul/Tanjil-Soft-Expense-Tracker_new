
import React from 'react';
import { DashboardStats } from '../types';

interface DashboardCardsProps {
  stats: DashboardStats;
  currencySymbol: string;
}

const DashboardCards: React.FC<DashboardCardsProps> = ({ stats, currencySymbol }) => {
  const cards = [
    {
      title: 'Net Balance',
      value: stats.netBalance,
      icon: 'fa-university',
      color: 'indigo',
      gradient: 'from-indigo-500 to-violet-600',
    },
    {
      title: 'Total Income',
      value: stats.totalIncome,
      icon: 'fa-arrow-trend-up',
      color: 'emerald',
      gradient: 'from-emerald-500 to-teal-600',
    },
    {
      title: 'Total Expense',
      value: stats.totalExpense,
      icon: 'fa-arrow-trend-down',
      color: 'rose',
      gradient: 'from-rose-500 to-pink-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card) => (
        <div 
          key={card.title}
          className="relative overflow-hidden glass-card p-6 rounded-2xl shadow-xl transition-transform hover:scale-[1.02] cursor-default"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{card.title}</p>
              <h2 className="text-3xl font-bold text-slate-800 dark:text-white">
                {currencySymbol}{card.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </h2>
            </div>
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-lg`}>
              <i className={`fas ${card.icon} text-white text-xl`}></i>
            </div>
          </div>
          
          {/* Background Decoration */}
          <div className={`absolute -bottom-6 -right-6 w-24 h-24 bg-${card.color}-500 opacity-5 rounded-full blur-2xl`}></div>
        </div>
      ))}
    </div>
  );
};

export default DashboardCards;
