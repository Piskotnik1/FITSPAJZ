import { StyleSheet } from 'react-native';

import { farby } from './farby';

export const styly = StyleSheet.create({
  obrazovka: { flex: 1, backgroundColor: farby.pozadie },
  obsah: { padding: 16, gap: 12 },
  karta: {
    backgroundColor: farby.biela,
    borderRadius: 12,
    padding: 14,
    gap: 4,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  nadpis: { fontSize: 17, fontWeight: '600', color: farby.text },
  text: { fontSize: 15, color: farby.text },
  popis: { fontSize: 13, color: farby.sedy },
  tlacidlo: {
    backgroundColor: farby.zelena,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  tlacidloText: { color: farby.biela, fontWeight: '600', fontSize: 15 },
  vstup: {
    backgroundColor: farby.biela,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
  },
});
