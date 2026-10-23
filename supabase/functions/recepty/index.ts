// Supabase Edge Function (Deno): vygeneruje zdravé recepty zo surovín v špajzi pomocou Claude.
// API kľúč je uložený ako tajomstvo na serveri (ANTHROPIC_API_KEY), nikdy nie v appke.
import Anthropic from 'npm:@anthropic-ai/sdk@^1.1.0';
import { betaZodOutputFormat } from 'npm:@anthropic-ai/sdk@^1.1.0/helpers/beta/zod';
import { z } from 'npm:zod@^4';

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

const client = new Anthropic(); // číta ANTHROPIC_API_KEY z tajomstiev servera

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

  try {
    const odpoved = await client.beta.messages.parse({
      model: 'claude-opus-5-5',
      max_tokens: 16000,
      output_config: { effort: 'medium', format: betaZodOutputFormat(Odpoved) },
      // Ak by model požiadavku odmietol, server ju skúsi s iným modelom.
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      system: SYSTEM,
      messages: [{ role: 'user', content: text }],
    });

    if (odpoved.stop_reason === 'refusal' || !odpoved.parsed_output) {
      return json({ chyba: 'Recepty sa nepodarilo vygenerovať' }, 502);
    }

    // Kontrola výstupu: povolené sú len suroviny zo špajze a základné dochucovadlá,
    // gramáž najviac toľko, koľko je doma.
    const doma = new Map(potraviny.map((p) => [p.nazov.toLowerCase(), p]));
    const dochucovadla = new Set(ZAKLADNE_DOCHUCOVADLA.map((n) => n.toLowerCase()));

    const recepty = odpoved.parsed_output.recepty
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
