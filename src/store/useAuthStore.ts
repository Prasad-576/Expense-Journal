import { create } from 'zustand';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useExpenseStore } from './useExpenseStore';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  initAuthListener: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isAuthLoading: true,
  initAuthListener: () => {
    onAuthStateChanged(auth, (user) => {
      set({
        user,
        isAuthenticated: !!user,
        isAuthLoading: false,
      });
      if (user) {
        // Use email for data isolation to match the existing database structure
        const identifier = user.email || user.uid;
        useExpenseStore.getState().initData(identifier);
      } else {
        useExpenseStore.getState().clearData();
      }
    });
  },
}));
