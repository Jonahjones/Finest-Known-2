import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { colors, spacing, borderRadius, shadows } from '../../design/tokens';

export type CardVariant = 'default' | 'flat' | 'outline';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: CardVariant;
  padding?: CardPadding;
}

export function Card({
  children,
  style,
  variant = 'default',
  padding = 'md',
}: CardProps) {
  const cardStyle = [
    styles.base,
    styles[variant],
    styles[`${padding}Padding`],
    style,
  ];

  return (
    <View style={cardStyle}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: borderRadius.md,
    backgroundColor: colors.background,
  },
  
  // Variants
  default: {
    ...shadows.sm,
  },
  flat: {
    backgroundColor: colors.surface,
  },
  outline: {
    borderWidth: 1,
    borderColor: colors.border,
  },
  
  // Padding
  nonePadding: {
    padding: 0,
  },
  smPadding: {
    padding: spacing.sm,
  },
  mdPadding: {
    padding: spacing.md,
  },
  lgPadding: {
    padding: spacing.lg,
  },
});
