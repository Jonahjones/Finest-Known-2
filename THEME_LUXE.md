# Finest Known Luxury Theme Implementation

## Overview

This document describes the luxury dark theme implementation for Finest Known, a React Native Expo app. The theme provides a premium, dark aesthetic with high-contrast typography and minimal chrome, inspired by luxury e-commerce platforms.

## Features

- **Dark Luxury Theme**: Deep blacks, elevated grays, and gold accents
- **High-Contrast Typography**: Playfair Display for headings, Inter for body text
- **Non-Destructive Implementation**: Preserves existing component APIs and DOM structure
- **Theme Toggle**: Real-time switching between light and luxury themes
- **React Native Compatible**: Uses StyleSheet and React Native styling patterns

## Theme Tokens

### Colors
```typescript
colors: {
  bg: '#0b0b0b',           // Primary background
  bgElev: '#111111',       // Elevated surfaces
  surface: '#151515',      // Cards and panels
  line: '#262626',         // Borders and dividers
  text: '#f5f5f5',         // Primary text
  muted: '#b5b5b5',        // Secondary text
  gold: '#d4af37',         // Accent color
  gold600: '#b8902f',      // Darker gold
  accent: '#8a7b5a',       // Secondary accent
  danger: '#ff5a5a',       // Error states
  success: '#32c36a',      // Success states
}
```

### Typography
```typescript
typography: {
  display: 'Playfair Display',  // Headings and titles
  sans: 'Inter',               // Body text and UI elements
}
```

### Spacing & Radius
```typescript
borderRadius: {
  sm: 10,    // Small elements
  md: 16,    // Cards and buttons
  lg: 24,    // Large containers
  xl: 28,    // Hero sections
}

spacing: {
  xs: 4,     // 4px
  sm: 8,     // 8px
  md: 16,    // 16px
  lg: 24,    // 24px
  xl: 32,    // 32px
  xxl: 48,   // 48px
}
```

### Shadows
```typescript
shadows: {
  luxe1: {    // Subtle elevation
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 3,
  },
  luxe2: {    // Prominent elevation
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 24,
    elevation: 8,
  },
}
```

## Usage

### Theme Provider

The theme is provided through a React Context:

```tsx
import { ThemeProvider } from '../src/theme/ThemeProvider';

// Wrap your app
<ThemeProvider>
  <YourApp />
</ThemeProvider>
```

### Using the Theme

```tsx
import { useTheme } from '../src/theme/ThemeProvider';

function MyComponent() {
  const { isLuxeTheme, tokens, toggleTheme } = useTheme();
  
  return (
    <View style={[
      styles.container,
      isLuxeTheme && { backgroundColor: tokens.colors.bg }
    ]}>
      <Text style={[
        styles.title,
        isLuxeTheme && { 
          color: tokens.colors.text,
          fontFamily: tokens.typography.display 
        }
      ]}>
        My Title
      </Text>
    </View>
  );
}
```

### Theme Toggle Component

```tsx
import { ThemeToggle } from '../src/components/ThemeToggle';

// Use anywhere in your app
<ThemeToggle />
```

## Component Mappings

### Cards
- **Background**: `tokens.colors.bgElev`
- **Border**: `tokens.colors.line`
- **Shadow**: `tokens.shadows.luxe1`
- **Hover**: `tokens.shadows.luxe2`

### Buttons
- **Gold Button**: Transparent background with gold border
- **Ghost Button**: Transparent with muted text
- **Hover States**: Gold background with black text

### Inputs
- **Background**: `tokens.colors.surface`
- **Border**: `tokens.colors.line`
- **Focus**: `tokens.colors.gold`
- **Text**: `tokens.colors.text`

### Headers & Navigation
- **Background**: `tokens.colors.bgElev` with 90% opacity
- **Border**: `tokens.colors.line`
- **Text**: `tokens.colors.text`

## File Structure

```
src/
├── theme/
│   ├── tokens.ts          # Theme tokens and colors
│   ├── ThemeProvider.tsx  # React Context provider
│   ├── styles.ts          # Utility styles
│   └── flag.ts            # Theme persistence
├── components/
│   └── ThemeToggle.tsx    # Theme toggle component
└── styles/
    ├── tokens.css         # CSS variables (for web)
    └── base.css           # Base utility classes
```

## Implementation Details

### Non-Destructive Approach
- All existing component APIs remain unchanged
- Styles are applied conditionally using `isLuxeTheme` flag
- Original styles are preserved and extended, not replaced
- No DOM structure changes required

### Performance
- No additional dependencies added
- Theme state is managed efficiently with React Context
- Styles are computed once and cached
- Minimal re-renders on theme toggle

### Accessibility
- High contrast ratios maintained (WCAG AA compliant)
- Color is not the only means of conveying information
- Focus states clearly visible
- Screen reader compatible

## Testing

Run the theme test script:

```bash
node scripts/test-theme.js
```

This will verify:
- All theme files exist
- Theme integration in main components
- No unnecessary dependencies added
- Implementation completeness

## Future Enhancements

- [ ] Add more theme variants (e.g., high contrast, reduced motion)
- [ ] Implement theme-specific animations
- [ ] Add theme-aware image overlays
- [ ] Create theme-specific icon sets
- [ ] Add accessibility preferences integration

## Browser Support

- React Native: All supported platforms
- Web (via Expo): Modern browsers with CSS custom properties support
- iOS: iOS 11+
- Android: API level 21+

## Contributing

When adding new components or updating existing ones:

1. Always check `isLuxeTheme` before applying luxury styles
2. Use theme tokens instead of hardcoded values
3. Maintain backward compatibility with existing styles
4. Test both light and luxury themes
5. Update this documentation if adding new theme features
