import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl || 'https://rhwuncdxjlzmsgiprdkz.supabase.co';
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJod3VuY2R4amx6bXNnaXByZGt6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxNDM4OTYsImV4cCI6MjA3MzcxOTg5Nn0.3jvar_teSXL2NtV7WEA3yQofFxLc_ZeewfpLyTBksAY';

// Custom storage implementation to debug session persistence
const customStorage = {
  getItem: async (key: string) => {
    console.log('CustomStorage: Getting item:', key);
    const value = await AsyncStorage.getItem(key);
    console.log('CustomStorage: Retrieved value:', value ? 'present' : 'null');
    return value;
  },
  setItem: async (key: string, value: string) => {
    console.log('CustomStorage: Setting item:', key, 'value length:', value?.length);
    await AsyncStorage.setItem(key, value);
    console.log('CustomStorage: Item set successfully');
  },
  removeItem: async (key: string) => {
    console.log('CustomStorage: Removing item:', key);
    await AsyncStorage.removeItem(key);
    console.log('CustomStorage: Item removed successfully');
  },
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: customStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    flowType: 'pkce',
  },
  global: {
    headers: {
      'x-my-custom-header': 'finestknown-app',
    },
  },
});
