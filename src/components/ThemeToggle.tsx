import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeProvider';

export function ThemeToggle() {
  const { isLuxeTheme: isLuxeThemeRaw, toggleTheme, tokens } = useTheme();
  // Ensure boolean type to prevent Java casting errors on React Native bridge
  const isLuxeTheme = Boolean(isLuxeThemeRaw);

  return (
    <TouchableOpacity 
      style={[styles.toggle, { backgroundColor: tokens.colors.surface, borderColor: tokens.colors.line }]}
      onPress={toggleTheme}
    >
      <Ionicons 
        name={isLuxeTheme ? "moon" : "sunny"} 
        size={20} 
        color={isLuxeTheme ? tokens.colors.gold : tokens.colors.muted} 
      />
      <Text style={[styles.toggleText, { color: tokens.colors.text }]}>
        {isLuxeTheme ? 'Luxe' : 'Light'}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  toggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
