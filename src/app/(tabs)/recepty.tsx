import { Link } from 'expo-router';
import { FlatList, Pressable, Text, View } from 'react-native';

import { UKAZKOVE_RECEPTY } from '@/data/ukazkoveRecepty';
import { chybajuceSuroviny, vyzivaReceptu } from '@/lib/vyziva';
import { useSpajza } from '@/store/spajza';
import { farby } from '@/ui/farby';
import { styly } from '@/ui/styly';

export default function Recepty() {
  const spajza = useSpajza((s) => s.potraviny);

  // Najprv recepty, na ktoré mám najviac surovín.
  const recepty = UKAZKOVE_RECEPTY.map((r) => ({
    recept: r,
    chyba: chybajuceSuroviny(r, spajza),
    vyziva: vyzivaReceptu(r, spajza),
  })).sort((a, b) => a.chyba.length - b.chyba.length);

  return (
    <View style={styly.obrazovka}>
      <FlatList
        contentContainerStyle={styly.obsah}
        data={recepty}
        keyExtractor={(x) => x.recept.id}
        ListHeaderComponent={
          <Text style={styly.popis}>
            Zatiaľ ukážkové recepty. Generovanie receptov cez AI z tvojej špajze pridáme v ďalšom kroku.
          </Text>
        }
        renderItem={({ item }) => (
          <Link href={{ pathname: '/recept/[id]', params: { id: item.recept.id } }} asChild>
            <Pressable style={styly.karta}>
              <Text style={styly.nadpis}>{item.recept.nazov}</Text>
              <Text style={styly.popis}>
                {Math.round(item.vyziva.naPorciu.kcal)} kcal na porciu · {item.recept.porcie}{' '}
                {item.recept.porcie === 1 ? 'porcia' : 'porcie'} · {item.recept.casMinut} min
              </Text>
              <Text style={{ fontSize: 13, color: item.chyba.length ? farby.cervena : farby.zelena }}>
                {item.chyba.length
                  ? `Chýba: ${item.chyba.map((s) => s.nazov).join(', ')}`
                  : 'Máš všetko doma'}
              </Text>
            </Pressable>
          </Link>
        )}
      />
    </View>
  );
}
