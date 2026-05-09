import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppState } from '../types';

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      subscriptions: [],
      exchangeRate: 1461.80,
      exchangeRateDate: '2026-05-09T00:02:31Z',
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
      version: 2,
      migrate: (persisted: unknown, version: number) => {
        const state = persisted as Record<string, unknown>;
        if (version < 2) {
          state.exchangeRate = 1461.80;
          state.exchangeRateDate = '2026-05-09T00:02:31Z';
        }
        return state as AppState;
      },
    }
  )
);
