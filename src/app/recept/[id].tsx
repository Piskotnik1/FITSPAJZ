import { Stack, useLocalSearchParams } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';

import { UKAZKOVE_RECEPTY } from '@/data/ukazkoveRecepty';
import { vyzivaReceptu } from '@/lib/vyziva';
import { useSpajza } from '@/store/spajza';
import { farby } from '@/ui/farby';
import { styly } from '@/ui/styly';
import { Vyziva } from '@/types';

function Riadok({ nazov, v }: { nazov: string; v: Vyziva }) {
  return (
    <View style={[styly.karta, { flex: 1, backgroundColor: farby.zelenaSvetla }]}>
      <Text style={styly.popis}>{nazov}</Text>
      <Text style={[styly.nadpis, { color: farby.zelena }]}>{Math.round(v.kcal)} kcal</Text>
      <Text style={styly.popis}>
        B {Math.round(v.bielkoviny)} g · S {Math.round(v.sacharidy)} g · T {Math.round(v.tuky)} g
      </Text>
    </View>
  );
}

export default function DetailReceptu() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const spajza = useSpajza((s) => s.potraviny);
  const recept = UKAZKOVE_RECEPTY.find((r) => r.id === id);
  if (!recept) return <Text style={styly.text}>Recept sa nenašiel.</Text>;

  const { spolu, naPorciu } = vyzivaReceptu(recept, spajza);

  return (
    <ScrollView style={styly.obrazovka} contentContainerStyle={styly.obsah}>
      <Stack.Screen options={{ title: recept.nazov }} />
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <Riadok nazov="Celý recept" v={spolu} />
        <Riadok nazov="Na porciu" v={naPorciu} />
      </View>

      <Text style={styly.nadpis}>Suroviny</Text>
      {recept.suroviny.map((s) => (
        <Text key={s.nazov} style={styly.text}>
          • {s.nazov}, {s.gramy} g
        </Text>
      ))}

      <Text style={styly.nadpis}>Postup</Text>
      {recept.postup.map((krok, i) => (
        <Text key={i} style={styly.text}>
          {i + 1}. {krok}
        </Text>
      ))}
    </ScrollView>
  );
}
