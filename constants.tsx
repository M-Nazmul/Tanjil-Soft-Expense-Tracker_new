
import { Category } from './types';

export const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: 'Salary', icon: 'fa-wallet', type: 'income' },
  { id: '2', name: 'Business', icon: 'fa-briefcase', type: 'income' },
  { id: '3', name: 'Investment', icon: 'fa-chart-line', type: 'income' },
  { id: '4', name: 'Food', icon: 'fa-utensils', type: 'expense' },
  { id: '5', name: 'Rent', icon: 'fa-home', type: 'expense' },
  { id: '6', name: 'Transport', icon: 'fa-car', type: 'expense' },
  { id: '7', name: 'Shopping', icon: 'fa-shopping-bag', type: 'expense' },
  { id: '8', name: 'Entertainment', icon: 'fa-film', type: 'expense' },
  { id: '9', name: 'Health', icon: 'fa-heartbeat', type: 'expense' },
];

export const CATEGORY_ICONS = [
  'fa-wallet', 'fa-briefcase', 'fa-chart-line', 'fa-utensils', 'fa-home',
  'fa-car', 'fa-shopping-bag', 'fa-film', 'fa-heartbeat', 'fa-gift',
  'fa-coffee', 'fa-plane', 'fa-gas-pump', 'fa-mobile-alt', 'fa-book'
];
