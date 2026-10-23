import { Potravina, Recept } from '../types';

// Adresa a verejný kľúč Supabase projektu (súbor .env). Verejný kľúč smie byť v appke,
// tajný kľúč pre AI je uložený iba na serveri.
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_KLUC = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

/** Je server na generovanie receptov nastavený? */
export const jeServerNastaveny = Boolean(SUPABASE_URL && SUPABASE_KLUC);

/** Pošle zoznam potravín na server, ktorý pomocou AI vymyslí recepty. */
export async function vygenerujRecepty(
  spajza: Potravina[],
  porcie: number,
  alergeny: string[] = [],
): Promise<Recept[]> {
  if (!jeServerNastaveny) throw new Error('Server na recepty nie je nastavený');

  const res = await fetch(`${SUPABASE_URL}/functions/v1/recepty`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: SUPABASE_KLUC!,
      Authorization: `Bearer ${SUPABASE_KLUC}`,
    },
    body: JSON.stringify({
      porcie,
      alergeny,
      potraviny: spajza.map((p) => ({ nazov: p.nazov, mameG: p.mnozstvoG })),
    }),
  });

  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.recepty) throw new Error(data?.chyba ?? 'Recepty sa nepodarilo vygenerovať');
  return data.recepty as Recept[];
}
