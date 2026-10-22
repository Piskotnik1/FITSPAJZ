import { Link } from 'expo-router';
import { FlatList, Pressable, Text, View } from 'react-native';

import { useSpajza } from '@/store/spajza';
import { farby } from '@/ui/farby';
import { styly } from '@/ui/styly';

export default function Spajza() {
  const potraviny = useSpajza((s) => s.potraviny);
  const odober = useSpajza((s) => s.odober);

  return (
    <View style={styly.obrazovka}>
      <FlatList
        contentContainerStyle={styly.obsah}
        data={potraviny}
        keyExtractor={(p) => p.id}
        renderItem={({ item }) => (
          <View style={[styly.karta, { flexDirection: 'row', alignItems: 'center' }]}>
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={styly.nadpis}>{item.nazov}</Text>
              <Text style={styly.popis}>
                {item.mnozstvoG} g · {Math.round(item.vyziva.kcal)} kcal/100 g
                {item.nutriScore ? ` · Nutri-Score ${item.nutriScore.toUpperCase()}` : ''}
              </Text>
            </View>
            <Pressable onPress={() => odober(item.id)} hitSlop={10}>
              <Text style={{ color: farby.cervena, fontSize: 14 }}>Odobrať</Text>
            </Pressable>
          </View>
        )}
        ListEmptyComponent={
          <Text style={[styly.popis, { textAlign: 'center', marginTop: 40 }]}>
            Špajza je prázdna. Naskenuj čiarový kód alebo pridaj potravinu ručne.
          </Text>
        }
        ListFooterComponent={
          <Link href="/pridat-rucne" asChild>
            <Pressable style={styly.tlacidlo}>
              <Text style={styly.tlacidloText}>+ Pridať ručne</Text>
            </Pressable>
          </Link>
        }
      />
    </View>
  );
}
