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
                <Stack screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="(tabs)" />
                  <Stack.Screen name="auth" />
                  <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
                  <Stack.Screen name="checkout" options={{ presentation: 'modal' }} />
                  <Stack.Screen name="item/[id]" />
                  <Stack.Screen name="catalog" />
                </Stack>
              </View>
            </RealtimeProvider>
          </AuthProvider>
        </QueryProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
