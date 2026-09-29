export type Category = '🍔 Food' | '⛽ Petrol' | '🛒 Shopping' | '🎓 College' | '💡 Utilities' | '🎉 Entertainment';
export const CATEGORIES: Category[] = ['🍔 Food', '⛽ Petrol', '🛒 Shopping', '🎓 College', '💡 Utilities', '🎉 Entertainment'];

export interface Expense {
  id: string;
  amount: number;
  title: string;
  category: Category;
  date: string; // ISO string YYYY-MM-DD
  tags?: string[];
}

export interface QuickExpense {
  id: string;
  title: string;
  amount: number;
  category: Category;
  emoji: string;
}

export interface WeeklySummary {
  date: string;
  total: number;
}

export interface AppSettings {
  currency: string; // default 'INR'
  monthlyLimit: number; // default 15000
}
