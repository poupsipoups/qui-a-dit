import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { KeyboardProvider } from 'react-native-keyboard-controller';

import { AppDataProvider } from '@/features/app/app-data';
import { Colors } from '@/theme/tokens';

export default function RootLayout() {
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
