import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { Potravina } from '../types';

type SpajzaState = {
  potraviny: Potravina[];
  pridaj: (p: Omit<Potravina, 'id'>) => void;
  odober: (id: string) => void;
};

/** Stav špajze, uložený v telefóne, takže prežije zatvorenie appky. */
export const useSpajza = create<SpajzaState>()(
  persist(
    (set) => ({
      potraviny: [],
      pridaj: (p) =>
        set((s) => {
          // Rovnaká potravina sa nepridá dvakrát, len sa navýši množstvo.
          const existujuca = s.potraviny.find((x) => x.nazov === p.nazov);
          if (existujuca) {
            return {
              potraviny: s.potraviny.map((x) =>
                x.id === existujuca.id ? { ...x, mnozstvoG: x.mnozstvoG + p.mnozstvoG } : x,
              ),
            };
          }
          return { potraviny: [...s.potraviny, { ...p, id: `${Date.now()}-${Math.random()}` }] };
        }),
      odober: (id) => set((s) => ({ potraviny: s.potraviny.filter((p) => p.id !== id) })),
    }),
    { name: 'spajza', storage: createJSONStorage(() => AsyncStorage) },
  ),
);
