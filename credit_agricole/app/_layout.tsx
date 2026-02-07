import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { useEffect, useState } from 'react';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  // TEMP → plus tard AsyncStorage / Firebase
  const [isLogged, setIsLogged] = useState(false);
  const [loading, setLoading] = useState(true);

  /* Simule chargement session */
  useEffect(() => {
    const checkAuth = async () => {
      // ICI plus tard : token / storage
      setTimeout(() => {
        setIsLogged(true); // true si connecté
        setLoading(false);
      }, 500);
    };

    checkAuth();
  }, []);

  /* Redirection */
  useEffect(() => {
    if (!loading && !isLogged) {
      router.replace('/(auth)/login');
    }
  }, [loading, isLogged]);

  /* Empêche flash écran */
  if (loading) {
    return null;
  }

  return (
    <ThemeProvider
      value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
    >
      <Stack screenOptions={{ headerShown: false }}>

        {/* Auth */}
        <Stack.Screen
          name="(auth)"
          options={{ headerShown: false }}
        />

        {/* Tabs */}
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false }}
        />

        {/* Modal */}
        <Stack.Screen
          name="modal"
          options={{
            presentation: 'modal',
            title: 'Modal',
          }}
        />

      </Stack>

      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
