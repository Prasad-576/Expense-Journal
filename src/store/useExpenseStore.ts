import { create } from 'zustand';
import { 
  collection, doc, setDoc, deleteDoc, onSnapshot, query, orderBy, updateDoc 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Expense, AppSettings, QuickExpense } from '../types';
import { useAuthStore } from './useAuthStore';

interface ExpenseState {
  expenses: Expense[];
  settings: AppSettings;
  quickExpenses: QuickExpense[];
  isLoading: boolean;
  unsubscribers: Array<() => void>;
  
  // Initialization
  initData: (uid: string) => void;
  clearData: () => void;

  // Actions
  addExpense: (expense: Omit<Expense, 'id'>) => Promise<void>;
  updateExpense: (id: string, expense: Partial<Expense>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  
  updateSettings: (settings: Partial<AppSettings>) => Promise<void>;
  
  addQuickExpense: (expense: Omit<QuickExpense, 'id'>) => Promise<void>;
  deleteQuickExpense: (id: string) => Promise<void>;
}

const DEFAULT_SETTINGS: AppSettings = {
  currency: '₹',
  monthlyLimit: 15000,
};

export const useExpenseStore = create<ExpenseState>((set, get) => ({
  expenses: [],
  settings: DEFAULT_SETTINGS,
  quickExpenses: [],
  isLoading: true,
  unsubscribers: [],
  
  initData: (uid: string) => {
    // Clear any previous listeners
    get().clearData();
    set({ isLoading: true });

    const newUnsubscribers: Array<() => void> = [];

    // 1. Listen to expenses
    const expensesRef = collection(db, `users/${uid}/transactions`);
    const qExpenses = query(expensesRef, orderBy('date', 'desc'));
    const unsubExpenses = onSnapshot(qExpenses, (snapshot) => {
      const expenses = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Expense));
      set({ expenses });
    }, (error) => console.error("Error fetching expenses:", error));
    newUnsubscribers.push(unsubExpenses);

    // 2. Listen to settings
    const settingsRef = doc(db, `users/${uid}/settings/preferences`);
    const unsubSettings = onSnapshot(settingsRef, (docSnap) => {
      if (docSnap.exists()) {
        set({ settings: docSnap.data() as AppSettings });
      } else {
        // Initialize settings if they don't exist
        setDoc(settingsRef, DEFAULT_SETTINGS).catch(console.error);
        set({ settings: DEFAULT_SETTINGS });
      }
    }, (error) => console.error("Error fetching settings:", error));
    newUnsubscribers.push(unsubSettings);

    // 3. Listen to quick expenses
    const quickExpensesRef = collection(db, `users/${uid}/quickExpenses`);
    const unsubQuickExpenses = onSnapshot(quickExpensesRef, (snapshot) => {
      const quickExpenses = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as QuickExpense));
      set({ quickExpenses });
      set({ isLoading: false }); // Stop loading after all basic data fetched
    }, (error) => console.error("Error fetching quick expenses:", error));
    newUnsubscribers.push(unsubQuickExpenses);

    set({ unsubscribers: newUnsubscribers });
  },

  clearData: () => {
    // Unsubscribe from all active listeners
    get().unsubscribers.forEach(unsub => unsub());
    set({
      expenses: [],
      settings: DEFAULT_SETTINGS,
      quickExpenses: [],
      isLoading: false,
      unsubscribers: [],
    });
  },

  addExpense: async (expenseData) => {
    const uid = useAuthStore.getState().user?.uid;
    if (!uid) return;
    const expensesRef = collection(db, `users/${uid}/transactions`);
    const newDocRef = doc(expensesRef);
    await setDoc(newDocRef, { ...expenseData, id: newDocRef.id });
  },
  
  updateExpense: async (id, updatedData) => {
    const uid = useAuthStore.getState().user?.uid;
    if (!uid) return;
    const expenseRef = doc(db, `users/${uid}/transactions/${id}`);
    await updateDoc(expenseRef, updatedData);
  },
  
  deleteExpense: async (id) => {
    const uid = useAuthStore.getState().user?.uid;
    if (!uid) return;
    const expenseRef = doc(db, `users/${uid}/transactions/${id}`);
    await deleteDoc(expenseRef);
  },
  
  updateSettings: async (newSettings) => {
    const uid = useAuthStore.getState().user?.uid;
    if (!uid) return;
    const settingsRef = doc(db, `users/${uid}/settings/preferences`);
    await updateDoc(settingsRef, newSettings);
  },
  
  addQuickExpense: async (expenseData) => {
    const uid = useAuthStore.getState().user?.uid;
    if (!uid) return;
    const quickExpensesRef = collection(db, `users/${uid}/quickExpenses`);
    const newDocRef = doc(quickExpensesRef);
    await setDoc(newDocRef, { ...expenseData, id: newDocRef.id });
  },
  
  deleteQuickExpense: async (id) => {
    const uid = useAuthStore.getState().user?.uid;
    if (!uid) return;
    const quickExpenseRef = doc(db, `users/${uid}/quickExpenses/${id}`);
    await deleteDoc(quickExpenseRef);
  }
}));
