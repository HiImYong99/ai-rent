import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppState } from '../types';

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      subscriptions: [],
      exchangeRate: 1510.33,
      exchangeRateDate: '2026-04-03T14:34:00Z',
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
      setExchangeRate: (rate, date) => set({ exchangeRate: rate, exchangeRateDate: date }),
    }),
    {
      name: 'ai-sub-storage',
      version: 1,
      migrate: (persisted: unknown, version: number) => {
        const state = persisted as Record<string, unknown>;
        if (version === 0) {
          state.exchangeRate = 1510.33;
          state.exchangeRateDate = '2026-04-03T14:34:00Z';
        }
        return state as AppState;
      },
    }
  )
);
