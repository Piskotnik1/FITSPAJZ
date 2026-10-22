import { Recept } from '../types';

/**
 * Dočasné ukážkové recepty, kým nebude hotové generovanie cez AI.
 * Suroviny sa volajú rovnako ako v ZAKLADNE, aby sa dali spárovať so špajzou.
 */
export const UKAZKOVE_RECEPTY: Recept[] = [
  {
    id: 'omeleta-zelenina',
    nazov: 'Zeleninová omeleta',
    porcie: 1,
    casMinut: 10,
    suroviny: [
      { nazov: 'Vajce', gramy: 120 },
      { nazov: 'Paprika', gramy: 60 },
      { nazov: 'Špenát', gramy: 40 },
      { nazov: 'Olivový olej', gramy: 5 },
    ],
    postup: [
      'Papriku nakrájaj na kocky, špenát nasekaj.',
      'Na oleji krátko opeč papriku, pridaj špenát.',
      'Zalej rozšľahanými vajcami, osoľ a peč 3 až 4 minúty.',
    ],
  },
  {
    id: 'kura-ryza-brokolica',
    nazov: 'Kuracie prsia s ryžou a brokolicou',
    porcie: 2,
    casMinut: 25,
    suroviny: [
      { nazov: 'Kuracie prsia', gramy: 300 },
      { nazov: 'Ryža', gramy: 140 },
      { nazov: 'Brokolica', gramy: 250 },
      { nazov: 'Olivový olej', gramy: 10 },
    ],
    postup: [
      'Ryžu uvar podľa návodu.',
      'Brokolicu rozober na ružičky a 5 minút dus na pare.',
      'Kuracie prsia nakrájaj, okoreň a opeč na oleji dozlatista.',
      'Podávaj spolu.',
    ],
  },
  {
    id: 'ovsena-kasa',
    nazov: 'Ovsená kaša s banánom a jablkom',
    porcie: 1,
    casMinut: 8,
    suroviny: [
      { nazov: 'Ovsené vločky', gramy: 50 },
      { nazov: 'Mlieko', gramy: 200 },
      { nazov: 'Banán', gramy: 60 },
      { nazov: 'Jablko', gramy: 80 },
    ],
    postup: [
      'Vločky povar v mlieku 4 až 5 minút.',
      'Pridaj nakrájaný banán a nastrúhané jablko.',
    ],
  },
  {
    id: 'cestoviny-paradajky',
    nazov: 'Cestoviny s paradajkovou omáčkou a syrom',
    porcie: 2,
    casMinut: 20,
    suroviny: [
      { nazov: 'Cestoviny', gramy: 160 },
      { nazov: 'Paradajka', gramy: 300 },
      { nazov: 'Cibuľa', gramy: 60 },
      { nazov: 'Olivový olej', gramy: 10 },
      { nazov: 'Syr eidam', gramy: 30 },
    ],
    postup: [
      'Cestoviny uvar al dente.',
      'Na oleji speň cibuľu, pridaj nakrájané paradajky a 10 minút povar.',
      'Zmiešaj s cestovinami a posyp strúhaným syrom.',
    ],
  },
];
