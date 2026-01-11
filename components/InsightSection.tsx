
import React, { useState } from 'react';
import { getFinancialInsights } from '../services/geminiService';
import { Transaction } from '../types';

interface InsightSectionProps {
  transactions: Transaction[];
}

const InsightSection: React.FC<InsightSectionProps> = ({ transactions }) => {
  const [insights, setInsights] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGetInsights = async () => {
    setLoading(true);
    const result = await getFinancialInsights(transactions);
    setInsights(result);
    setLoading(false);
  };

  return (
    <div className="glass-card p-6 rounded-2xl shadow-xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
        <i className="fas fa-robot text-4xl text-indigo-500"></i>
      </div>
      
      <h3 className="text-lg font-semibold mb-2 text-slate-800 dark:text-white flex items-center gap-2">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
        </span>
        AI Insights
      </h3>
      
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
        Get personalized advice based on your spending habits using Gemini AI.
      </p>

      {insights ? (
        <div className="bg-indigo-50/50 dark:bg-indigo-900/20 p-4 rounded-xl text-sm text-slate-700 dark:text-indigo-100 leading-relaxed border border-indigo-100/50 dark:border-indigo-800/50">
          <div className="prose prose-sm dark:prose-invert">
            {insights.split('\n').map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
          <button 
            onClick={() => setInsights(null)}
            className="mt-4 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Clear and reset
          </button>
        </div>
      ) : (
        <button
          onClick={handleGetInsights}
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-95 disabled:opacity-50"
        >
          {loading ? (
            <>
              <i className="fas fa-circle-notch animate-spin"></i>
              Analyzing Patterns...
            </>
          ) : (
            <>
              <i className="fas fa-wand-magic-sparkles"></i>
              Get Financial Insights
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default InsightSection;
