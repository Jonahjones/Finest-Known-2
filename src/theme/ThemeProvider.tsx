import React, { createContext, useContext, useEffect, useState } from 'react';
import { luxeTokens } from './tokens';
import { isLuxeThemeEnabled, enableLuxeTheme, disableLuxeTheme } from './flag';

interface ThemeContextType {
  isLuxeTheme: boolean;
  toggleTheme: () => Promise<void>;
  tokens: typeof luxeTokens;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isLuxeTheme, setIsLuxeTheme] = useState(true); // Enable luxury theme by default

  useEffect(() => {
    const loadThemeState = async () => {
      const enabled = await isLuxeThemeEnabled();
      setIsLuxeTheme(enabled);
    };
    loadThemeState();
  }, []);

  const toggleTheme = async () => {
    if (isLuxeTheme) {
      await disableLuxeTheme();
      setIsLuxeTheme(false);
    } else {
      await enableLuxeTheme();
      setIsLuxeTheme(true);
    }
  };

  return (
    <ThemeContext.Provider value={{ isLuxeTheme, toggleTheme, tokens: luxeTokens }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
