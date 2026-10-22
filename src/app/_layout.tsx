import { Stack } from 'expo-router';

import { farby } from '@/ui/farby';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerTintColor: farby.zelena }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="pridat-rucne" options={{ title: 'Pridať ručne', presentation: 'modal' }} />
      <Stack.Screen name="recept/[id]" options={{ title: 'Recept' }} />
    </Stack>
  );
}
