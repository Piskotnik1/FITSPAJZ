import { router } from 'expo-router';
import { useState } from 'react';
import { FlatList, Pressable, Text, TextInput, View } from 'react-native';

import { ZAKLADNE } from '@/data/zakladnePotraviny';
import { useSpajza } from '@/store/spajza';
import { farby } from '@/ui/farby';
import { styly } from '@/ui/styly';

export default function PridatRucne() {
  const [hladam, setHladam] = useState('');
  const [vybrana, setVybrana] = useState<string | null>(null);
  const [gramy, setGramy] = useState('100');
  const pridaj = useSpajza((s) => s.pridaj);

  const zoznam = ZAKLADNE.filter((z) => z.nazov.toLowerCase().includes(hladam.toLowerCase()));

  return (
    <View style={[styly.obrazovka, styly.obsah]}>
      <TextInput style={styly.vstup} placeholder="Hľadať potravinu" value={hladam} onChangeText={setHladam} />
      <FlatList
        style={{ flex: 1 }}
        data={zoznam}
        keyExtractor={(z) => z.nazov}
        renderItem={({ item }) => {
          const jeVybrana = item.nazov === vybrana;
          return (
            <Pressable
              onPress={() => setVybrana(item.nazov)}
              style={[
                styly.karta,
                { marginBottom: 8 },
                jeVybrana && { borderColor: farby.zelena, backgroundColor: farby.zelenaSvetla },
              ]}>
              <Text style={styly.text}>{item.nazov}</Text>
              <Text style={styly.popis}>{item.vyziva.kcal} kcal/100 g</Text>
            </Pressable>
          );
        }}
      />
      <Text style={styly.text}>Množstvo (g)</Text>
      <TextInput style={styly.vstup} keyboardType="numeric" value={gramy} onChangeText={setGramy} />
      <Pressable
        style={[styly.tlacidlo, !vybrana && { opacity: 0.4 }]}
        disabled={!vybrana}
        onPress={() => {
          const z = ZAKLADNE.find((x) => x.nazov === vybrana)!;
          pridaj({ nazov: z.nazov, vyziva: z.vyziva, mnozstvoG: Number(gramy) || 100 });
          router.back();
        }}>
        <Text style={styly.tlacidloText}>Pridať do špajze</Text>
      </Pressable>
    </View>
  );
}
