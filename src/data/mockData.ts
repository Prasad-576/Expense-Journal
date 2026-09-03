import type { Expense, QuickExpense } from '../types';
import { subDays, format } from 'date-fns';

const today = new Date();
const yesterday = subDays(today, 1);

export const CATEGORIES = ['🍔 Food', '⛽ Petrol', '🛒 Shopping', '🎓 College', '💡 Utilities', '🎉 Entertainment'] as const;

export const MOCK_EXPENSES: Expense[] = [
  {
    id: '1',
    amount: 250,
    title: 'Pizza',
    category: '🍔 Food',
    date: format(today, 'yyyy-MM-dd'),
    tags: ['Lunch', 'Office'],
  },
  {
    id: '2',
    amount: 500,
    title: 'Fuel',
    category: '⛽ Petrol',
    date: format(today, 'yyyy-MM-dd'),
    tags: ['Commute'],
  },
  {
    id: '3',
    amount: 900,
    title: 'Books',
    category: '🎓 College',
    date: format(yesterday, 'yyyy-MM-dd'),
    tags: [],
  },
  {
    id: '4',
    amount: 1500,
    title: 'Grocery',
    category: '🛒 Shopping',
    date: format(yesterday, 'yyyy-MM-dd'),
    tags: ['Home'],
  },
  {
    id: '5',
    amount: 150,
    title: 'Bus Ticket',
    category: '🎉 Entertainment',
    date: format(subDays(today, 1), 'yyyy-MM-dd'),
    tags: [],
  },
  {
    id: '6',
    amount: 300,
    title: 'Movie',
    category: '🎉 Entertainment',
    date: format(subDays(today, 3), 'yyyy-MM-dd'),
    tags: ['Friends'],
  },
  {
    id: '7',
    amount: 450,
    title: 'College Fees',
    category: '🎓 College',
    date: format(subDays(today, 4), 'yyyy-MM-dd'),
    tags: [],
  },
  {
    id: '8',
    amount: 200,
    title: 'Snacks',
    category: '🍔 Food',
    date: format(subDays(today, 4), 'yyyy-MM-dd'),
    tags: [],
  },
  {
    id: '9',
    amount: 800,
    title: 'Shirt',
    category: '🛒 Shopping',
    date: format(subDays(today, 6), 'yyyy-MM-dd'),
    tags: [],
  },
  {
    id: '10',
    amount: 50,
    title: 'Tea',
    category: '🍔 Food',
    date: format(subDays(today, 7), 'yyyy-MM-dd'),
    tags: [],
  },
  {
    id: '11',
    amount: 1500,
    title: 'Electricity Bill',
    category: '💡 Utilities',
    date: format(subDays(today, 8), 'yyyy-MM-dd'),
    tags: ['Home'],
  },
  {
    id: '12',
    amount: 120,
    title: 'Netflix',
    category: '🎉 Entertainment',
    date: format(subDays(today, 14), 'yyyy-MM-dd'),
    tags: [],
  },
  {
    id: '13',
    amount: 60,
    title: 'Coffee',
    category: '🍔 Food',
    date: format(subDays(today, 15), 'yyyy-MM-dd'),
    tags: [],
  }
];

export const MOCK_QUICK_EXPENSES: QuickExpense[] = [
  { id: 'q1', amount: 80, title: 'Coffee', category: '🍔 Food', emoji: '☕' },
  { id: 'q2', amount: 350, title: 'Pizza', category: '🍔 Food', emoji: '🍕' },
  { id: 'q3', amount: 500, title: 'Petrol', category: '⛽ Petrol', emoji: '⛽' },
  { id: 'q4', amount: 200, title: 'Auto', category: '⛽ Petrol', emoji: '🛺' },
  { id: 'q5', amount: 1500, title: 'Groceries', category: '🛒 Shopping', emoji: '🛍️' },
];
