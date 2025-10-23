import React from 'react';
import { Stack } from 'expo-router';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryProvider } from '../src/providers/QueryProvider';
import { AuthProvider } from '../src/store/AuthContext';
import { RealtimeProvider } from '../src/providers/RealtimeProvider';
import { AuthWrapper } from '../src/components/AuthWrapper';
import { LivePricesTicker } from '../src/components/LivePricesTicker';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryProvider>
        <AuthProvider>
          <RealtimeProvider>
            <View style={{ flex: 1 }}>
              <LivePricesTicker />
              <AuthWrapper>
                <Stack>
                  <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                  <Stack.Screen name="auth" options={{ headerShown: false }} />
                  <Stack.Screen name="modal" options={{ presentation: 'modal', headerShown: false }} />
                  <Stack.Screen name="checkout" options={{ presentation: 'modal', headerShown: false }} />
                </Stack>
              </AuthWrapper>
            </View>
          </RealtimeProvider>
        </AuthProvider>
      </QueryProvider>
    </GestureHandlerRootView>
  );
}
