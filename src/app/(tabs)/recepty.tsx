import { Link } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';

import { jeServerNastaveny, vygenerujRecepty } from '@/api/recepty';
import { UKAZKOVE_RECEPTY } from '@/data/ukazkoveRecepty';
import { chybajuceSuroviny, vyzivaReceptu } from '@/lib/vyziva';
import { useRecepty } from '@/store/recepty';
import { useSpajza } from '@/store/spajza';
import { farby } from '@/ui/farby';
import { styly } from '@/ui/styly';

const PORCIE = 2;

export default function Recepty() {
  const spajza = useSpajza((s) => s.potraviny);
  const aiRecepty = useRecepty((s) => s.recepty);
  const nastavRecepty = useRecepty((s) => s.nastav);
  const [nacitavam, setNacitavam] = useState(false);
  const [chyba, setChyba] = useState<string | null>(null);

  async function vymysli() {
    setNacitavam(true);
    setChyba(null);
    try {
      nastavRecepty(await vygenerujRecepty(spajza, PORCIE));
    } catch (e) {
      setChyba(e instanceof Error ? e.message : 'Niečo sa pokazilo');
    } finally {
      setNacitavam(false);
    }
  }

  // Kým nie je server nastavený alebo nič nevygenerované, ukážeme ukážkové recepty.
  const zdroj = aiRecepty.length ? aiRecepty : UKAZKOVE_RECEPTY;

  // Najprv recepty, na ktoré mám najviac surovín.
  const recepty = zdroj
    .map((r) => ({ recept: r, chyba: chybajuceSuroviny(r, spajza), vyziva: vyzivaReceptu(r, spajza) }))
    .sort((a, b) => a.chyba.length - b.chyba.length);

  return (
    <View style={styly.obrazovka}>
      <FlatList
        contentContainerStyle={styly.obsah}
        data={recepty}
        keyExtractor={(x) => x.recept.id}
        ListHeaderComponent={
          <View style={{ gap: 8 }}>
            {jeServerNastaveny ? (
              <Pressable
                style={[styly.tlacidlo, (nacitavam || !spajza.length) && { opacity: 0.5 }]}
                disabled={nacitavam || !spajza.length}
                onPress={vymysli}>
                {nacitavam ? (
                  <ActivityIndicator color={farby.biela} />
                ) : (
                  <Text style={styly.tlacidloText}>Vymysli recepty z mojej špajze</Text>
                )}
              </Pressable>
            ) : (
              <Text style={styly.popis}>
                Server na AI recepty ešte nie je nastavený, zobrazujú sa ukážkové recepty.
              </Text>
            )}
            {!spajza.length && jeServerNastaveny && (
              <Text style={styly.popis}>Najprv pridaj potraviny do špajze.</Text>
            )}
            {chyba && <Text style={{ color: farby.cervena }}>{chyba}</Text>}
            {!aiRecepty.length && jeServerNastaveny && (
              <Text style={styly.popis}>Zatiaľ ukážkové recepty.</Text>
            )}
          </View>
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
