import React from 'react';
import { Tabs } from 'expo-router';
import { Platform, View, Text } from 'react-native';
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
  const { isLuxeTheme, tokens } = useTheme();
  
  // Debug logging
  console.log('TabLayout - isLuxeTheme:', isLuxeTheme);
  console.log('TabLayout - tokens:', tokens);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: isLuxeTheme ? (tokens?.colors?.gold || '#D4AF37') : '#000000',
        tabBarInactiveTintColor: isLuxeTheme ? (tokens?.colors?.muted || '#B5B5B5') : '#6B7280',
        tabBarLabelStyle: {
          fontSize: 13,
          fontWeight: '600',
        },
        headerShown: false,
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
          tabBarIcon: ({ color, focused, size }) => (
            <View style={styles.tabIconContainer}>
              <Ionicons 
                name={focused ? 'home' : 'home-outline'} 
                size={size || 24} 
                color={color} 
              />
              {focused && <View style={styles.activeIndicator} />}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="catalog"
        options={{
          title: 'Catalog',
          tabBarIcon: ({ color, focused, size }) => (
            <View style={styles.tabIconContainer}>
              <Ionicons 
                name={focused ? 'grid' : 'grid-outline'} 
                size={size || 24} 
                color={color} 
              />
              {focused && <View style={styles.activeIndicator} />}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="auctions"
        options={{
          title: 'Auctions',
          tabBarIcon: ({ color, focused, size }) => (
            <View style={styles.tabIconContainer}>
              <Ionicons 
                name={focused ? 'hammer' : 'hammer-outline'} 
                size={size || 24} 
                color={color} 
              />
              {focused && <View style={styles.activeIndicator} />}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          tabBarIcon: ({ color, focused, size }) => (
            <View style={styles.tabIconContainer}>
              <Ionicons 
                name={focused ? 'bag' : 'bag-outline'} 
                size={size || 24} 
                color={color} 
              />
              {cartItemCount > 0 && (
                <View style={[styles.badge, isLuxeTheme && { backgroundColor: tokens?.colors?.gold || '#D4AF37' }]}>
                  <Text style={[styles.badgeText, isLuxeTheme && { color: tokens?.colors?.bg || '#0B0B0B' }]}>
                    {cartItemCount > 99 ? '99+' : cartItemCount}
                  </Text>
                </View>
              )}
              {focused && <View style={styles.activeIndicator} />}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          title: 'Learn',
          tabBarIcon: ({ color, focused, size }) => (
            <View style={styles.tabIconContainer}>
              <Ionicons 
                name={focused ? 'book' : 'book-outline'} 
                size={size || 24} 
                color={color} 
              />
              {focused && <View style={styles.activeIndicator} />}
            </View>
          ),
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

const styles = {
  tabIconContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -8,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#00D4AA',
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#00D4AA',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
};
