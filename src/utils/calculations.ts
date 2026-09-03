import type { Expense } from '../types';
import { isToday, isThisMonth, isThisWeek, parseISO } from 'date-fns';

export function calculateTotal(expenses: Expense[]): number {
  return expenses.reduce((sum, exp) => sum + exp.amount, 0);
}

export function getTodayExpenses(expenses: Expense[]): Expense[] {
  return expenses.filter(exp => isToday(parseISO(exp.date)));
}

export function getThisMonthExpenses(expenses: Expense[]): Expense[] {
  return expenses.filter(exp => isThisMonth(parseISO(exp.date)));
}

export function getThisWeekExpenses(expenses: Expense[]): Expense[] {
  return expenses.filter(exp => isThisWeek(parseISO(exp.date), { weekStartsOn: 1 }));
}
