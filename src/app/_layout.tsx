import { Outfit_500Medium, Outfit_600SemiBold, Outfit_700Bold, Outfit_800ExtraBold } from '@expo-google-fonts/outfit';
import { Quicksand_700Bold } from '@expo-google-fonts/quicksand';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { KeyboardProvider } from 'react-native-keyboard-controller';

import { AppDataProvider } from '@/features/app/app-data';
import { Colors } from '@/theme/tokens';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({ Outfit_500Medium, Outfit_600SemiBold, Outfit_700Bold, Outfit_800ExtraBold, Quicksand_700Bold });

  useEffect(() => {
    if (fontsLoaded || fontError) SplashScreen.hideAsync();
  }, [fontsLoaded, fontError]);

  // Une erreur de chargement ne bloque pas le jeu : le texte retombe sur la police système.
  if (!fontsLoaded && !fontError) return null;

  return (
    <KeyboardProvider>
      <AppDataProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: Colors.background }, animation: 'fade' }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="questions" />
          <Stack.Screen name="game" options={{ gestureEnabled: false }} />
        </Stack>
      </AppDataProvider>
    </KeyboardProvider>
  );
}
