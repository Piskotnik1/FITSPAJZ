import { CameraView, useCameraPermissions } from 'expo-camera';
import { useIsFocused } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, Text, TextInput, View } from 'react-native';

import { najdiPodlaEan, NajdenyProdukt } from '@/api/openFoodFacts';
import { useSpajza } from '@/store/spajza';
import { styly } from '@/ui/styly';

type Stav =
  | { druh: 'skenujem' }
  | { druh: 'hladam'; ean: string }
  | { druh: 'najdene'; produkt: NajdenyProdukt }
  | { druh: 'nenajdene'; ean: string };

export default function Skenovat() {
  const [povolenie, poziadaj] = useCameraPermissions();
  const [stav, setStav] = useState<Stav>({ druh: 'skenujem' });
  const [gramy, setGramy] = useState('100');
  const pridaj = useSpajza((s) => s.pridaj);
  const jeAktivna = useIsFocused();

  if (!povolenie) return <View style={styly.obrazovka} />;

  if (!povolenie.granted) {
    return (
      <View style={[styly.obrazovka, styly.obsah, { justifyContent: 'center' }]}>
        <Text style={[styly.text, { textAlign: 'center' }]}>
          Na skenovanie čiarových kódov potrebujem prístup ku kamere.
        </Text>
        <Pressable style={styly.tlacidlo} onPress={poziadaj}>
          <Text style={styly.tlacidloText}>Povoliť kameru</Text>
        </Pressable>
      </View>
    );
  }

  async function naskenovane(ean: string) {
    if (stav.druh !== 'skenujem') return; // kamera hlási ten istý kód opakovane
    setStav({ druh: 'hladam', ean });
    try {
      const produkt = await najdiPodlaEan(ean);
      setStav(produkt ? { druh: 'najdene', produkt } : { druh: 'nenajdene', ean });
    } catch {
      setStav({ druh: 'nenajdene', ean });
    }
  }

  return (
    <View style={styly.obrazovka}>
      {stav.druh === 'skenujem' && jeAktivna && (
        <CameraView
          style={{ flex: 1 }}
          barcodeScannerSettings={{ barcodeTypes: ['ean13', 'ean8'] }}
          onBarcodeScanned={({ data }) => naskenovane(data)}
        />
      )}

      {stav.druh === 'hladam' && (
        <View style={[styly.obsah, { flex: 1, justifyContent: 'center' }]}>
          <ActivityIndicator size="large" />
          <Text style={[styly.popis, { textAlign: 'center' }]}>Hľadám {stav.ean}…</Text>
        </View>
      )}

      {stav.druh === 'najdene' && (
        <View style={styly.obsah}>
          <View style={styly.karta}>
            <Text style={styly.nadpis}>{stav.produkt.nazov}</Text>
            <Text style={styly.popis}>
              Na 100 g: {Math.round(stav.produkt.vyziva.kcal)} kcal · B {stav.produkt.vyziva.bielkoviny} g ·
              S {stav.produkt.vyziva.sacharidy} g · T {stav.produkt.vyziva.tuky} g
            </Text>
          </View>
          <Text style={styly.text}>Koľko gramov máš doma?</Text>
          <TextInput style={styly.vstup} keyboardType="numeric" value={gramy} onChangeText={setGramy} />
          <Pressable
            style={styly.tlacidlo}
            onPress={() => {
              pridaj({ ...stav.produkt, mnozstvoG: Number(gramy) || 100 });
              setStav({ druh: 'skenujem' });
            }}>
            <Text style={styly.tlacidloText}>Pridať do špajze</Text>
          </Pressable>
          <Pressable onPress={() => setStav({ druh: 'skenujem' })}>
            <Text style={[styly.popis, { textAlign: 'center' }]}>Zrušiť</Text>
          </Pressable>
        </View>
      )}

      {stav.druh === 'nenajdene' && (
        <View style={styly.obsah}>
          <Text style={styly.text}>
            Produkt s kódom {stav.ean} sa v databáze Open Food Facts nenašiel. Pridaj ho ručne.
          </Text>
          <Pressable style={styly.tlacidlo} onPress={() => setStav({ druh: 'skenujem' })}>
            <Text style={styly.tlacidloText}>Skenovať znova</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
