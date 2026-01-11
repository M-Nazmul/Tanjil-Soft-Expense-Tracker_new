
export type TransactionType = 'income' | 'expense';

export interface Category {
  id: string;
  name: string;
  icon: string;
  type: TransactionType;
}

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
}

export type TimeFilter = 'today' | 'yesterday' | 'weekly' | 'monthly' | 'all';

export interface DashboardStats {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
}
