import { DOCHUCOVADLA, najdiZakladnu } from '../data/zakladnePotraviny';
import { Potravina, Recept, Vyziva } from '../types';

const nula = (): Vyziva => ({ kcal: 0, bielkoviny: 0, sacharidy: 0, tuky: 0 });

/** Výživa suroviny: najprv z mojej špajze (presné hodnoty z obalu), inak zo základnej tabuľky. */
function vyzivaNa100g(nazov: string, spajza: Potravina[]): Vyziva | undefined {
  const zoSpajze = spajza.find((p) => p.nazov.toLowerCase() === nazov.toLowerCase());
  return zoSpajze?.vyziva ?? najdiZakladnu(nazov)?.vyziva;
}

/**
 * Kalórie a makrá receptu spolu aj na porciu.
 * Pre každú surovinu: hodnota na 100 g × gramy / 100, potom súčet.
 */
export function vyzivaReceptu(recept: Recept, spajza: Potravina[]) {
  const spolu = nula();
  for (const s of recept.suroviny) {
    const v = vyzivaNa100g(s.nazov, spajza);
    if (!v) continue;
    const k = s.gramy / 100;
    spolu.kcal += v.kcal * k;
    spolu.bielkoviny += v.bielkoviny * k;
    spolu.sacharidy += v.sacharidy * k;
    spolu.tuky += v.tuky * k;
  }
  const naPorciu: Vyziva = {
    kcal: spolu.kcal / recept.porcie,
    bielkoviny: spolu.bielkoviny / recept.porcie,
    sacharidy: spolu.sacharidy / recept.porcie,
    tuky: spolu.tuky / recept.porcie,
  };
  return { spolu, naPorciu };
}

/** Ktoré suroviny receptu v špajzi chýbajú (soľ, korenie, olej a vodu nepočítame). */
export function chybajuceSuroviny(recept: Recept, spajza: Potravina[]) {
  const rovnake = (a: string, b: string) => a.toLowerCase() === b.toLowerCase();
  return recept.suroviny.filter(
    (s) =>
      !DOCHUCOVADLA.some((d) => rovnake(d, s.nazov)) &&
      !spajza.some((p) => rovnake(p.nazov, s.nazov)),
  );
}
