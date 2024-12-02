import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import './../global.css';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { useColorScheme } from '@/hooks/useColorScheme';
import LandingPage from './landing';
import React from 'react';
import { AuthProvider } from '@/hooks/useAuth';
import { PinProvider } from '@/hooks/usePin';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const [showLandingPage, setShowLandingPage] = useState(true);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  // Show the LandingPage initially, then render the main tabs layout after dismissing it
  
  if (showLandingPage) {
    return <LandingPage onDismiss={() => setShowLandingPage(false)} />;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <AuthProvider>
            <PinProvider>
              <GestureHandlerRootView style={{ flex: 1 }}>
                <Stack screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="landing"/>
                  <Stack.Screen name="(tabs)"/>
                  <Stack.Screen name="+not-found" />
                </Stack>
              </GestureHandlerRootView>
            </PinProvider>
          </AuthProvider>
    </ThemeProvider>
  );
}

// Separate layout component to use AuthProvider properly
