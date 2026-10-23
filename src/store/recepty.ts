import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { Recept } from '../types';

type ReceptyState = {
  recepty: Recept[]; // posledné recepty vygenerované cez AI
  nastav: (r: Recept[]) => void;
};

export const useRecepty = create<ReceptyState>()(
  persist(
    (set) => ({
      recepty: [],
      nastav: (recepty) => set({ recepty }),
    }),
    { name: 'recepty', storage: createJSONStorage(() => AsyncStorage) },
  ),
);

/** Nájde recept podľa id medzi AI receptami aj ukážkovými. */
export function najdiRecept(id: string, ai: Recept[], ukazkove: Recept[]) {
  return ai.find((r) => r.id === id) ?? ukazkove.find((r) => r.id === id);
}
