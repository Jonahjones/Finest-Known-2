import { StyleSheet } from 'react-native';
import { luxeTokens } from './tokens';

const { colors, borderRadius, shadows, spacing } = luxeTokens;

export const luxeStyles = StyleSheet.create({
  // Base containers
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  elevatedContainer: {
    backgroundColor: colors.bgElev,
  },
  surface: {
    backgroundColor: colors.surface,
  },

  // Cards
  card: {
    backgroundColor: colors.bgElev,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.line,
    ...shadows.luxe1,
  },
  cardHover: {
    ...shadows.luxe2,
  },

  // Buttons
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    fontWeight: '500',
  },
  btnGold: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.gold,
  },
  btnGoldText: {
    color: colors.text,
  },
  btnGhost: {
    backgroundColor: 'transparent',
  },
  btnGhostText: {
    color: colors.muted,
  },

  // Inputs
  input: {
    backgroundColor: colors.surface,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  inputFocused: {
    borderColor: colors.gold,
  },

  // Tabs
  tabBar: {
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  tab: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: colors.gold,
  },
  tabText: {
    color: colors.muted,
  },
  tabTextActive: {
    color: colors.text,
  },

  // Typography
  heading: {
    fontFamily: 'Playfair Display',
    color: colors.text,
  },
  body: {
    fontFamily: 'Inter',
    color: colors.text,
  },
  muted: {
    color: colors.muted,
  },

  // Dividers
  divider: {
    borderTopWidth: 1,
    borderTopColor: colors.line,
    opacity: 0.7,
  },

  // Provenance chip
  provenanceChip: {
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: colors.gold + '99', // 60% opacity
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  provenanceChipText: {
    color: colors.gold,
    fontSize: 12,
  },

  // Header
  header: {
    backgroundColor: colors.bgElev + 'E6', // 90% opacity
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },

  // Bottom navigation
  bottomNav: {
    backgroundColor: colors.bgElev + 'F2', // 95% opacity
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },

  // Search bar
  searchContainer: {
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },

  // Spotlight effect (simulated with gradient)
  spotlight: {
    position: 'relative',
  },

  // Vignette effect (simulated with shadow)
  vignette: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 60,
    elevation: 0,
  },
});

// Utility functions for dynamic styling
export const getLuxeStyles = (isLuxeTheme: boolean) => {
  if (!isLuxeTheme) {
    return {}; // Return empty object for default theme
  }
  return luxeStyles;
};

export const getLuxeColors = (isLuxeTheme: boolean) => {
  if (!isLuxeTheme) {
    return {}; // Return empty object for default theme
  }
  return colors;
};
