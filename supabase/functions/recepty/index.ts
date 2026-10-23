// Supabase Edge Function (Deno): vygeneruje zdravé recepty zo surovín v špajzi pomocou
// bezplatnej AI Google Gemini. API kľúč je uložený ako tajomstvo na serveri (GEMINI_API_KEY),
// nikdy nie v appke. Kľúč zadarmo, bez platobnej karty: https://aistudio.google.com/apikey
import { z } from 'npm:zod@^4';

const GEMINI_KLUC = Deno.env.get('GEMINI_API_KEY');
const GEMINI_MODEL = Deno.env.get('GEMINI_MODEL') ?? 'gemini-2.5-flash';

/** Suroviny, ktoré má doma takmer každý, a preto ich recept smie použiť navyše. */
const ZAKLADNE_DOCHUCOVADLA = ['Soľ', 'Korenie', 'Olivový olej', 'Voda'];

const Poziadavka = z.object({
  porcie: z.number().int().min(1).max(8),
  potraviny: z
    .array(z.object({ nazov: z.string().min(1).max(100), mameG: z.number().positive() }))
    .min(1)
    .max(60),
  alergeny: z.array(z.string().max(50)).max(20).default([]),
});

const Odpoved = z.object({
  recepty: z.array(
    z.object({
      nazov: z.string(),
      porcie: z.number().int(),
      casMinut: z.number().int(),
      suroviny: z.array(z.object({ nazov: z.string(), gramy: z.number() })),
      postup: z.array(z.string()),
    }),
  ),
});

/** Rovnaká štruktúra ako Odpoved, v tvare, ktorý Gemini používa na štruktúrovaný výstup. */
const SCHEMA_ODPOVEDE = {
  type: 'OBJECT',
  properties: {
    recepty: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          nazov: { type: 'STRING' },
          porcie: { type: 'INTEGER' },
          casMinut: { type: 'INTEGER' },
          suroviny: {
            type: 'ARRAY',
            items: {
              type: 'OBJECT',
              properties: { nazov: { type: 'STRING' }, gramy: { type: 'NUMBER' } },
              required: ['nazov', 'gramy'],
            },
          },
          postup: { type: 'ARRAY', items: { type: 'STRING' } },
        },
        required: ['nazov', 'porcie', 'casMinut', 'suroviny', 'postup'],
      },
    },
  },
  required: ['recepty'],
};

const SYSTEM = `Si kuchár a výživový poradca. Navrhuješ zdravé recepty v slovenčine z potravín, ktoré má používateľ doma.

Pravidlá:
- Použi iba potraviny zo zoznamu používateľa. Názov suroviny napíš presne tak, ako je v zozname.
- Navyše smieš použiť len tieto bežné suroviny: ${ZAKLADNE_DOCHUCOVADLA.join(', ')}.
- Gramáž suroviny nesmie prekročiť množstvo, ktoré má používateľ doma.
- Recept je zdravý: veľa zeleniny a bielkovín, málo cukru, bez vyprážania, primerané porcie.
- Nikdy nepoužívaj potraviny s alergénmi, ktoré používateľ uviedol.
- Postup píš v krátkych krokoch, ktoré zvládne aj začiatočník.
- Navrhni 3 rôzne recepty. Ak sa z potravín nedá uvariť nič rozumné, vráť menej receptov.
- Kalórie nepočítaj, vypočíta ich aplikácia.`;

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type',
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  });
}

/** Pošle požiadavku do Gemini a vráti skontrolovanú odpoveď, alebo null. */
async function zavolajGemini(text: string) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': GEMINI_KLUC! },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM }] },
        contents: [{ role: 'user', parts: [{ text }] }],
        generationConfig: { responseMimeType: 'application/json', responseSchema: SCHEMA_ODPOVEDE },
      }),
    },
  );
  if (!res.ok) {
    console.error('Gemini', res.status, await res.text());
    return null;
  }
  const data = await res.json();
  const vystup = data?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text ?? '').join('');
  if (!vystup) return null;
  const overene = Odpoved.safeParse(JSON.parse(vystup));
  return overene.success ? overene.data : null;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS });
  if (req.method !== 'POST') return json({ chyba: 'Povolená je iba metóda POST' }, 405);

  const vstup = Poziadavka.safeParse(await req.json().catch(() => null));
  if (!vstup.success) return json({ chyba: 'Neplatná požiadavka' }, 400);
  const { porcie, potraviny, alergeny } = vstup.data;

  const zoznam = potraviny.map((p) => `- ${p.nazov}: ${p.mameG} g`).join('\n');
  const text =
    `Mám doma tieto potraviny:\n${zoznam}\n\nRecepty chcem pre ${porcie} ` +
    `${porcie === 1 ? 'porciu' : 'porcie'}.` +
    (alergeny.length ? `\nMám alergiu na: ${alergeny.join(', ')}.` : '');

  if (!GEMINI_KLUC) return json({ chyba: 'Na serveri chýba GEMINI_API_KEY' }, 500);

  try {
    const odpoved = await zavolajGemini(text);
    if (!odpoved) return json({ chyba: 'Recepty sa nepodarilo vygenerovať, skús to znova' }, 502);

    // Kontrola výstupu: povolené sú len suroviny zo špajze a základné dochucovadlá,
    // gramáž najviac toľko, koľko je doma.
    const doma = new Map(potraviny.map((p) => [p.nazov.toLowerCase(), p]));
    const dochucovadla = new Set(ZAKLADNE_DOCHUCOVADLA.map((n) => n.toLowerCase()));

    const recepty = odpoved.recepty
      .map((r, i) => ({
        ...r,
        id: `ai-${Date.now()}-${i}`,
        porcie,
        suroviny: r.suroviny
          .filter((s) => doma.has(s.nazov.toLowerCase()) || dochucovadla.has(s.nazov.toLowerCase()))
          .map((s) => {
            const p = doma.get(s.nazov.toLowerCase());
            return {
              nazov: p?.nazov ?? s.nazov,
              gramy: Math.round(p ? Math.min(s.gramy, p.mameG) : s.gramy),
            };
          }),
      }))
      .filter((r) => r.suroviny.length > 0);

    return json({ recepty });
  } catch (e) {
    console.error(e);
    return json({ chyba: 'Chyba pri volaní AI' }, 502);
  }
});
