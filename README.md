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
