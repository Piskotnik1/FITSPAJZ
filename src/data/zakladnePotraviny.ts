import { Vyziva } from '../types';

/**
 * Potraviny bez čiarového kódu pre ručné zadanie. Hodnoty na 100 g,
 * približné, podľa bežných kalorických tabuliek.
 */
export const ZAKLADNE: { nazov: string; vyziva: Vyziva }[] = [
  { nazov: 'Vajce', vyziva: { kcal: 143, bielkoviny: 12.6, sacharidy: 0.7, tuky: 9.5 } },
  { nazov: 'Kuracie prsia', vyziva: { kcal: 120, bielkoviny: 22.5, sacharidy: 0, tuky: 2.6 } },
  { nazov: 'Ryža', vyziva: { kcal: 360, bielkoviny: 6.6, sacharidy: 79, tuky: 0.6 } },
  { nazov: 'Cestoviny', vyziva: { kcal: 358, bielkoviny: 12.5, sacharidy: 71, tuky: 1.5 } },
  { nazov: 'Ovsené vločky', vyziva: { kcal: 372, bielkoviny: 13.5, sacharidy: 59, tuky: 7 } },
  { nazov: 'Zemiaky', vyziva: { kcal: 77, bielkoviny: 2, sacharidy: 17, tuky: 0.1 } },
  { nazov: 'Mrkva', vyziva: { kcal: 41, bielkoviny: 0.9, sacharidy: 9.6, tuky: 0.2 } },
  { nazov: 'Cibuľa', vyziva: { kcal: 40, bielkoviny: 1.1, sacharidy: 9.3, tuky: 0.1 } },
  { nazov: 'Paradajka', vyziva: { kcal: 18, bielkoviny: 0.9, sacharidy: 3.9, tuky: 0.2 } },
  { nazov: 'Paprika', vyziva: { kcal: 31, bielkoviny: 1, sacharidy: 6, tuky: 0.3 } },
  { nazov: 'Brokolica', vyziva: { kcal: 34, bielkoviny: 2.8, sacharidy: 6.6, tuky: 0.4 } },
  { nazov: 'Špenát', vyziva: { kcal: 23, bielkoviny: 2.9, sacharidy: 3.6, tuky: 0.4 } },
  { nazov: 'Banán', vyziva: { kcal: 89, bielkoviny: 1.1, sacharidy: 23, tuky: 0.3 } },
  { nazov: 'Jablko', vyziva: { kcal: 52, bielkoviny: 0.3, sacharidy: 14, tuky: 0.2 } },
  { nazov: 'Mlieko', vyziva: { kcal: 47, bielkoviny: 3.4, sacharidy: 4.8, tuky: 1.5 } },
  { nazov: 'Biely jogurt', vyziva: { kcal: 61, bielkoviny: 3.5, sacharidy: 4.7, tuky: 3.3 } },
  { nazov: 'Tvaroh', vyziva: { kcal: 98, bielkoviny: 17, sacharidy: 3.5, tuky: 0.5 } },
  { nazov: 'Syr eidam', vyziva: { kcal: 330, bielkoviny: 26, sacharidy: 0, tuky: 25 } },
  { nazov: 'Olivový olej', vyziva: { kcal: 884, bielkoviny: 0, sacharidy: 0, tuky: 100 } },
  { nazov: 'Celozrnný chlieb', vyziva: { kcal: 247, bielkoviny: 13, sacharidy: 41, tuky: 3.4 } },
  { nazov: 'Soľ', vyziva: { kcal: 0, bielkoviny: 0, sacharidy: 0, tuky: 0 } },
  { nazov: 'Korenie', vyziva: { kcal: 0, bielkoviny: 0, sacharidy: 0, tuky: 0 } },
  { nazov: 'Voda', vyziva: { kcal: 0, bielkoviny: 0, sacharidy: 0, tuky: 0 } },
];

/** Suroviny, ktoré má doma takmer každý. Recept ich smie použiť, aj keď nie sú v špajzi. */
export const DOCHUCOVADLA = ['Soľ', 'Korenie', 'Olivový olej', 'Voda'];

export function najdiZakladnu(nazov: string) {
  return ZAKLADNE.find((z) => z.nazov.toLowerCase() === nazov.toLowerCase());
}
