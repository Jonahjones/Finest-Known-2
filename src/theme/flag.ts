import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_FLAG_KEY = 'finestknown_luxe_theme_enabled';

export const enableLuxeTheme = async () => {
  await AsyncStorage.setItem(THEME_FLAG_KEY, 'true');
  // In React Native, we'll use a context/state system instead of DOM manipulation
};

export const disableLuxeTheme = async () => {
  await AsyncStorage.setItem(THEME_FLAG_KEY, 'false');
};

export const isLuxeThemeEnabled = async (): Promise<boolean> => {
  try {
    const value = await AsyncStorage.getItem(THEME_FLAG_KEY);
    console.log('Stored theme value:', value);
    return value === 'true';
  } catch (error) {
    console.warn('Error reading theme flag, defaulting to true:', error);
    return true; // Default to luxury theme
  }
};

// Check environment variable for initial theme state
export const getInitialThemeState = (): boolean => {
  // In React Native, we can't access process.env directly, so we'll use a different approach
  // This could be set via app config or build-time configuration
  return true; // Default to luxury theme
};
