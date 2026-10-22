/** Nutričné hodnoty na 100 g (alebo 100 ml). */
export type Vyziva = {
  kcal: number;
  bielkoviny: number;
  sacharidy: number;
  tuky: number;
};

export type Potravina = {
  id: string;
  nazov: string;
  ean?: string;
  mnozstvoG: number; // koľko toho mám doma
  vyziva: Vyziva;
  nutriScore?: string; // a–e z Open Food Facts
};

export type Surovina = { nazov: string; gramy: number };

export type Recept = {
  id: string;
  nazov: string;
  porcie: number;
  casMinut: number;
  suroviny: Surovina[];
  postup: string[];
};
