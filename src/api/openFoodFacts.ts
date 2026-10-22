import { Potravina } from '../types';

const URL = 'https://world.openfoodfacts.org/api/v2/product/';

export type NajdenyProdukt = Omit<Potravina, 'id' | 'mnozstvoG'>;

/** Nájde produkt podľa EAN kódu. Vráti null, ak ho databáza nepozná. */
export async function najdiPodlaEan(ean: string): Promise<NajdenyProdukt | null> {
  const res = await fetch(
    `${URL}${ean}.json?fields=product_name,product_name_sk,product_name_cs,nutriments,nutriscore_grade`,
  );
  if (!res.ok) return null;
  const data = await res.json();
  if (data.status !== 1) return null;

  const p = data.product;
  const n = p.nutriments ?? {};
  return {
    nazov: p.product_name_sk || p.product_name_cs || p.product_name || 'Neznámy produkt',
    ean,
    nutriScore: p.nutriscore_grade,
    vyziva: {
      kcal: n['energy-kcal_100g'] ?? 0,
      bielkoviny: n.proteins_100g ?? 0,
      sacharidy: n.carbohydrates_100g ?? 0,
      tuky: n.fat_100g ?? 0,
    },
  };
}
