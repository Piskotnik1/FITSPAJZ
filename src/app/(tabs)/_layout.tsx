import { Tabs } from 'expo-router/js-tabs';
import { Text } from 'react-native';

import { farby } from '@/ui/farby';

const ikona = (znak: string) => () => <Text style={{ fontSize: 20 }}>{znak}</Text>;

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: farby.zelena, headerTintColor: farby.text }}>
      <Tabs.Screen name="index" options={{ title: 'Špajza', tabBarIcon: ikona('🧺') }} />
      <Tabs.Screen name="skenovat" options={{ title: 'Skenovať', tabBarIcon: ikona('📷') }} />
      <Tabs.Screen name="recepty" options={{ title: 'Recepty', tabBarIcon: ikona('🍳') }} />
    </Tabs>
  );
}
