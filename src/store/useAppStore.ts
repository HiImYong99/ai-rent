import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppState } from '../types';

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      subscriptions: [],
      exchangeRate: 1350,
      addSubscription: (sub) =>
        set((state) => ({
          subscriptions: [
            ...state.subscriptions,
            { ...sub, id: crypto.randomUUID() },
          ],
        })),
      updateSubscription: (id, updatedSub) =>
        set((state) => ({
          subscriptions: state.subscriptions.map((sub) =>
            sub.id === id ? { ...sub, ...updatedSub } : sub
          ),
        })),
      removeSubscription: (id) =>
        set((state) => ({
          subscriptions: state.subscriptions.filter((sub) => sub.id !== id),
        })),
      setExchangeRate: (rate) => set({ exchangeRate: rate }),
    }),
    {
      name: 'ai-sub-storage',
    }
  )
);
