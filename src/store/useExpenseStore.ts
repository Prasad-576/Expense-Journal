import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Expense, AppSettings, QuickExpense } from '../types';
import { MOCK_EXPENSES, MOCK_QUICK_EXPENSES } from '../data/mockData';

interface ExpenseState {
  expenses: Expense[];
  settings: AppSettings;
  quickExpenses: QuickExpense[];
  
  // Actions
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  
  updateSettings: (settings: Partial<AppSettings>) => void;
  
  addQuickExpense: (expense: Omit<QuickExpense, 'id'>) => void;
  deleteQuickExpense: (id: string) => void;
}

export const useExpenseStore = create<ExpenseState>()(
  persist(
    (set) => ({
      expenses: MOCK_EXPENSES,
      settings: {
        currency: '₹',
        monthlyLimit: 15000,
      },
      quickExpenses: MOCK_QUICK_EXPENSES,
      
      addExpense: (expenseData) => set((state) => {
        const newExpense: Expense = {
          ...expenseData,
          id: Math.random().toString(36).substring(2, 9),
        };
        const updatedExpenses = [newExpense, ...state.expenses];
        return { expenses: updatedExpenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) };
      }),
      
      updateExpense: (id, updatedData) => set((state) => {
        const updatedExpenses = state.expenses.map(exp => 
          exp.id === id ? { ...exp, ...updatedData } : exp
        );
        return { expenses: updatedExpenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) };
      }),
      
      deleteExpense: (id) => set((state) => ({
        expenses: state.expenses.filter(exp => exp.id !== id)
      })),
      
      updateSettings: (newSettings) => set((state) => ({
        settings: { ...state.settings, ...newSettings }
      })),
      
      addQuickExpense: (expenseData) => set((state) => {
        const newQE: QuickExpense = {
          ...expenseData,
          id: Math.random().toString(36).substring(2, 9),
        };
        return { quickExpenses: [...state.quickExpenses, newQE] };
      }),
      
      deleteQuickExpense: (id) => set((state) => ({
        quickExpenses: state.quickExpenses.filter(qe => qe.id !== id)
      }))
    }),
    {
      name: 'expense-tracker-storage',
      partialize: (state) => ({
        // You can choose to persist only settings and quickExpenses if you want to keep MOCK_EXPENSES fresh,
        // but for a fully functional frontend demo, persisting expenses is good so user additions stay across reloads.
        expenses: state.expenses,
        settings: state.settings,
        quickExpenses: state.quickExpenses,
      }),
    }
  )
);
