
import React, { useMemo } from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, 
  AreaChart, Area, XAxis, YAxis, CartesianGrid 
} from 'recharts';
import { Transaction, Category } from '../types';

interface AnalyticsProps {
  transactions: Transaction[];
  categories: Category[];
  currencySymbol: string;
}

const COLORS = ['#6366f1', '#10b981', '#f43f5e', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#14b8a6'];

const Analytics: React.FC<AnalyticsProps> = ({ transactions, categories, currencySymbol }) => {
  const expenseData = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const categoryTotals: Record<string, number> = {};
    
    expenses.forEach(t => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    });

    return Object.entries(categoryTotals).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  const trendData = useMemo(() => {
    const last30Days: Record<string, { date: string; income: number; expense: number }> = {};
    const now = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const dateStr = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      last30Days[dateStr] = { date: dateStr, income: 0, expense: 0 };
    }

    transactions.forEach(t => {
      const dateStr = new Date(t.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      if (last30Days[dateStr]) {
        if (t.type === 'income') last30Days[dateStr].income += t.amount;
        else last30Days[dateStr].expense += t.amount;
      }
    });

    return Object.values(last30Days);
  }, [transactions]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="glass-card p-6 rounded-2xl shadow-xl min-h-[400px]">
        <h3 className="text-lg font-semibold mb-6 text-slate-800 dark:text-white flex items-center gap-2">
          <i className="fas fa-chart-pie text-indigo-500"></i>
          Expense Distribution
        </h3>
        <div className="h-72">
          {expenseData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {expenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                  formatter={(value: number) => [`${currencySymbol}${value.toLocaleString()}`, 'Amount']}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
              <i className="fas fa-chart-area text-4xl mb-2 opacity-20"></i>
              <p>No expense data to show</p>
            </div>
          )}
        </div>
      </div>

      <div className="glass-card p-6 rounded-2xl shadow-xl min-h-[400px]">
        <h3 className="text-lg font-semibold mb-6 text-slate-800 dark:text-white flex items-center gap-2">
          <i className="fas fa-chart-line text-emerald-500"></i>
          Cash Flow Trends
        </h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="date" hide />
              <YAxis hide />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                formatter={(value: number) => [`${currencySymbol}${value.toLocaleString()}`, 'Amount']}
              />
              <Area type="monotone" dataKey="income" stroke="#10b981" fillOpacity={1} fill="url(#colorIncome)" />
              <Area type="monotone" dataKey="expense" stroke="#f43f5e" fillOpacity={1} fill="url(#colorExpense)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
