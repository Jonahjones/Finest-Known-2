import React from 'react';
import { Tabs } from 'expo-router';
import { Platform, View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
// import { colors, typography } from '../../src/design/tokens';
import { useCartItemCount } from '../../src/hooks/useCart';
import { useTheme } from '../../src/theme/ThemeProvider';
// import { HapticTab } from '../../components/haptic-tab';
// import { TabBarBackground } from '../../components/ui/tab-bar-background';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const cartItemCount = useCartItemCount();
  const { isLuxeTheme: isLuxeThemeRaw, tokens } = useTheme();
  // Ensure boolean type to prevent Java casting errors on React Native bridge
  const isLuxeTheme = Boolean(isLuxeThemeRaw);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: isLuxeTheme ? (tokens?.colors?.gold || '#D4AF37') : '#000000',
        tabBarInactiveTintColor: isLuxeTheme ? (tokens?.colors?.muted || '#B5B5B5') : '#6B7280',
        tabBarLabelStyle: {
          fontSize: 13,
          fontWeight: '600',
        },
        headerShown: Boolean(false),
        // tabBarButton: HapticTab,
        // tabBarBackground: TabBarBackground,
        tabBarStyle: {
          backgroundColor: isLuxeTheme ? (tokens?.colors?.bgElev || '#111111') : '#FFFFFF',
          borderTopColor: isLuxeTheme ? (tokens?.colors?.line || '#262626') : '#E5E7EB',
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 90 : 50 + insets.bottom,
          paddingBottom: Platform.OS === 'ios' ? 20 : Math.max(insets.bottom, 4),
          paddingTop: Platform.OS === 'ios' ? 10 : 4,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused, size }) => {
            // Ensure boolean type to prevent Java casting errors
            const isFocused = Boolean(focused);
            return (
              <View style={styles.tabIconContainer}>
                <Ionicons 
                  name={isFocused ? 'home' : 'home-outline'} 
                  size={size || 24} 
                  color={color} 
                />
                {isFocused && <View style={styles.activeIndicator} />}
              </View>
            );
          },
        }}
      />
      <Tabs.Screen
        name="catalog"
        options={{
          title: 'Catalog',
          tabBarIcon: ({ color, focused, size }) => {
            // Ensure boolean type to prevent Java casting errors
            const isFocused = Boolean(focused);
            return (
              <View style={styles.tabIconContainer}>
                <Ionicons 
                  name={isFocused ? 'grid' : 'grid-outline'} 
                  size={size || 24} 
                  color={color} 
                />
                {isFocused && <View style={styles.activeIndicator} />}
              </View>
            );
          },
        }}
      />
      <Tabs.Screen
        name="auctions"
        options={{
          title: 'Auctions',
          tabBarIcon: ({ color, focused, size }) => {
            // Ensure boolean type to prevent Java casting errors
            const isFocused = Boolean(focused);
            return (
              <View style={styles.tabIconContainer}>
                <Ionicons 
                  name={isFocused ? 'hammer' : 'hammer-outline'} 
                  size={size || 24} 
                  color={color} 
                />
                {isFocused && <View style={styles.activeIndicator} />}
              </View>
            );
          },
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          tabBarIcon: ({ color, focused, size }) => {
            // Ensure boolean type to prevent Java casting errors
            const isFocused = Boolean(focused);
            return (
              <View style={styles.tabIconContainer}>
                <Ionicons 
                  name={isFocused ? 'bag' : 'bag-outline'} 
                  size={size || 24} 
                  color={color} 
                />
                {cartItemCount > 0 && (
                  <View style={[styles.badge, isLuxeTheme ? { backgroundColor: tokens?.colors?.gold || '#D4AF37' } : null]}>
                    <Text style={[styles.badgeText, isLuxeTheme ? { color: tokens?.colors?.bg || '#0B0B0B' } : null]}>
                      {cartItemCount > 99 ? '99+' : cartItemCount}
                    </Text>
                  </View>
                )}
                {isFocused && <View style={styles.activeIndicator} />}
              </View>
            );
          },
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          title: 'Learn',
          tabBarIcon: ({ color, focused, size }) => {
            // Ensure boolean type to prevent Java casting errors
            const isFocused = Boolean(focused);
            return (
              <View style={styles.tabIconContainer}>
                <Ionicons 
                  name={isFocused ? 'book' : 'book-outline'} 
                  size={size || 24} 
                  color={color} 
                />
                {isFocused && <View style={styles.activeIndicator} />}
              </View>
            );
          },
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          href: null, // Hide from tab bar
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabIconContainer: {
    position: 'relative' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  activeIndicator: {
    position: 'absolute' as const,
    bottom: -8,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#00D4AA',
  },
  badge: {
    position: 'absolute' as const,
    top: -8,
    right: -8,
    backgroundColor: '#00D4AA',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600' as const,
  },
});
