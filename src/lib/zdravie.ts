import { Potravina, Recept } from '../types';
import { vyzivaReceptu } from './vyziva';

/** Zelenina zo základných potravín. Zelenina sa do zdravia počíta navyše. */
const ZELENINA = ['mrkva', 'cibuľa', 'paradajka', 'paprika', 'brokolica', 'špenát'];

export type Hodnotenie = {
  body: number; // 1 až 5
  dovody: string[]; // čo hodnotenie zvýšilo alebo znížilo
};

/**
 * Jednoduché hodnotenie zdravosti receptu na porciu (1 až 5 bodov).
 * Pravidlá vychádzajú z bežných odporúčaní: dosť bielkovín, nie priveľa tukov,
 * primeraná energia na jedlo a dosť zeleniny.
 */
export function hodnotZdravie(recept: Recept, spajza: Potravina[]): Hodnotenie {
  const { naPorciu } = vyzivaReceptu(recept, spajza);
  const dovody: string[] = [];
  let body = 3;

  const kcal = naPorciu.kcal || 1;
  const podielBielkovin = (naPorciu.bielkoviny * 4) / kcal; // 1 g bielkovín = 4 kcal
  const podielTukov = (naPorciu.tuky * 9) / kcal; // 1 g tuku = 9 kcal

  if (podielBielkovin >= 0.2) {
    body += 1;
    dovody.push('Veľa bielkovín');
  }
  if (podielTukov > 0.4) {
    body -= 1;
    dovody.push('Veľa tukov');
  }
  if (naPorciu.kcal > 800) {
    body -= 1;
    dovody.push('Vysoká energia na porciu');
  }

  const zeleninaNaPorciu =
    recept.suroviny
      .filter((s) => ZELENINA.includes(s.nazov.toLowerCase()))
      .reduce((spolu, s) => spolu + s.gramy, 0) / recept.porcie;
  if (zeleninaNaPorciu >= 150) {
    body += 1;
    dovody.push('Dosť zeleniny');
  } else if (zeleninaNaPorciu === 0) {
    body -= 1;
    dovody.push('Bez zeleniny');
  }

  // Nutri-Score balených potravín z Open Food Facts (a = najlepšie, e = najhoršie).
  const zleNutriScore = recept.suroviny.some((s) => {
    const p = spajza.find((x) => x.nazov.toLowerCase() === s.nazov.toLowerCase());
    return p?.nutriScore === 'd' || p?.nutriScore === 'e';
  });
  if (zleNutriScore) {
    body -= 1;
    dovody.push('Obsahuje potravinu s Nutri-Score D alebo E');
  }

  return { body: Math.max(1, Math.min(5, body)), dovody };
}

export const hviezdy = (body: number) => '★'.repeat(body) + '☆'.repeat(5 - body);
