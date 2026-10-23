# Fit Špajza

Mobilná appka (Expo / React Native): evidencia potravín doma, skenovanie EAN kódov, recepty s kalóriami.

## Spustenie na telefóne cez Expo Go

1. Na počítači nainštaluj [Node.js](https://nodejs.org) (verzia LTS).
2. Na telefón nainštaluj **Expo Go** (Google Play / App Store).
3. V priečinku projektu spusti:
   ```
   npm install
   npx expo start
   ```
4. Naskenuj QR kód z terminálu: na Androide v appke Expo Go, na iPhone fotoaparátom.

Telefón a počítač musia byť na rovnakej Wi-Fi. Ak to nejde (napr. školská sieť), použi `npx expo start --tunnel`.

## Štruktúra

```
src/app/                obrazovky (Expo Router: súbor = obrazovka)
  (tabs)/index.tsx      Špajza
  (tabs)/skenovat.tsx   skenovanie EAN kódu
  (tabs)/recepty.tsx    recepty
  pridat-rucne.tsx      ručné pridanie potraviny
  recept/[id].tsx       detail receptu s kalóriami
src/api/openFoodFacts.ts   nutričné hodnoty podľa EAN
src/lib/vyziva.ts          výpočet kalórií spolu a na porciu
src/store/spajza.ts        stav špajze uložený v telefóne
src/data/                  základné potraviny a ukážkové recepty
```

## Recepty cez AI (server)

Recepty generuje bezplatná AI Google Gemini (model `gemini-2.5-flash`) cez malý server:
Supabase Edge Function v `supabase/functions/recepty/index.ts`. Všetko beží na bezplatných plánoch,
platobná karta netreba. API kľúč je uložený iba na serveri, appka posiela len zoznam potravín.

Server beží v Supabase projekte **FitSpajza** a appka ho nájde podľa súboru `.env`.
Jediné, čo treba nastaviť ručne, je tajomstvo `GEMINI_API_KEY` v Supabase
(Edge Functions → Secrets). Bezplatný kľúč bez karty získaš v [Google AI Studio](https://aistudio.google.com/apikey).
Bezplatný plán má limit asi 10 požiadaviek za minútu a 500 za deň, na testovanie a maturitu to stačí.

Novú verziu funkcie nasadíš príkazom `npx supabase functions deploy recepty --project-ref hlzmbkuiiuveawsqzasg`.

Kalórie receptu AI nepočíta: appka ich vypočíta sama z nutričných hodnôt na 100 g (`src/lib/vyziva.ts`).
Bez nastaveného servera appka zobrazuje ukážkové recepty.
