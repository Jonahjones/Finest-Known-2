import React from 'react';
import { Stack } from 'expo-router';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryProvider } from '../src/providers/QueryProvider';
import { AuthProvider } from '../src/store/AuthContext';
import { RealtimeProvider } from '../src/providers/RealtimeProvider';
import { ThemeProvider } from '../src/theme/ThemeProvider';
import { LivePricesTicker } from '../src/components/LivePricesTicker';
import { AppFlow } from '../src/components/AppFlow';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <QueryProvider>
          <AuthProvider>
            <RealtimeProvider>
              <View style={{ flex: 1 }}>
                <LivePricesTicker />
                <AppFlow />
                <Stack>
                  <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                  <Stack.Screen name="auth" options={{ headerShown: false }} />
                  <Stack.Screen name="modal" options={{ presentation: 'modal', headerShown: false }} />
                  <Stack.Screen name="checkout" options={{ presentation: 'modal', headerShown: false }} />
                  <Stack.Screen name="item/[id]" options={{ headerShown: false }} />
                  <Stack.Screen name="catalog" options={{ headerShown: false }} />
                </Stack>
              </View>
            </RealtimeProvider>
          </AuthProvider>
        </QueryProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
