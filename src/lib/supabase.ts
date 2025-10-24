import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl || 'https://oghzxwjqhsmbqfuovqju.supabase.co';
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9naHp4d2pxaHNtYnFmdW92cWp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY5MTc3MjAsImV4cCI6MjA1MjQ5MzcyMH0.1YHhWdXHWcx5Zb6qkxjBYTW_CJdvbzpI_DYoGmZYNgM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
  global: {
    headers: {
      'x-my-custom-header': 'finestknown-app',
    },
  },
});
