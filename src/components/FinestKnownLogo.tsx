import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { colors, typography } from '../design/tokens';

interface FinestKnownLogoProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
  style?: ViewStyle;
}

export function FinestKnownLogo({
  size = 'medium',
  showText = true,
  style,
}: FinestKnownLogoProps) {
  const sizeStyles = {
    small: styles.small,
    medium: styles.medium,
    large: styles.large,
  };

  const textSizeStyles = {
    small: styles.smallText,
    medium: styles.mediumText,
    large: styles.largeText,
  };

  return (
    <View style={[styles.container, sizeStyles[size], style]}>
      <View style={styles.logoContainer}>
        <View style={styles.logoCircle}>
          <Text style={[styles.logoText, textSizeStyles[size]]}>FK</Text>
        </View>
      </View>
      {showText && (
        <Text style={[styles.brandText, textSizeStyles[size]]}>
          FinestKnown
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  logoContainer: {
    marginRight: 8,
  },
  
  logoCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  logoText: {
    color: colors.text.inverse,
    fontWeight: '700',
    textAlign: 'center',
  },
  
  brandText: {
    color: colors.primary,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  
  // Size variants
  small: {
    // Container size for small
  },
  medium: {
    // Container size for medium
  },
  large: {
    // Container size for large
  },
  
  smallText: {
    fontSize: 12,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 24,
  },
});
