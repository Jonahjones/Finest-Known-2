import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AuthContext: Initializing auth state...');
    
    // Check what's in AsyncStorage - try different possible keys
    const possibleKeys = [
      'sb-rhwuncdxjlzmsgiprdkz-auth-token',
      'supabase.auth.token',
      'sb-rhwuncdxjlzmsgiprdkz-auth-token-code-verifier',
      'sb-rhwuncdxjlzmsgiprdkz-auth-token-code-challenge'
    ];
    
    possibleKeys.forEach(key => {
      AsyncStorage.getItem(key).then((stored) => {
        console.log(`AuthContext: AsyncStorage [${key}]:`, stored ? 'present' : 'empty');
      });
    });
    
    // Also check all keys
    AsyncStorage.getAllKeys().then((keys) => {
      console.log('AuthContext: All AsyncStorage keys:', keys?.filter(k => k.includes('supabase') || k.includes('auth')));
    });
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      console.log('AuthContext: Initial session check:', { 
        session: !!session, 
        user: !!session?.user, 
        userId: session?.user?.id,
        accessToken: session?.access_token ? 'present' : 'missing',
        error 
      });
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('AuthContext: Auth state change:', { 
        event, 
        session: !!session, 
        user: !!session?.user,
        userId: session?.user?.id,
        accessToken: session?.access_token ? 'present' : 'missing'
      });
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    console.log('AuthContext: signUp called with:', email);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    console.log('AuthContext: signUp result:', { user: !!data.user, session: !!data.session, error });
    return { data, error };
  };

  const signIn = async (email: string, password: string) => {
    console.log('AuthContext: signIn called with:', email);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    console.log('AuthContext: signIn result:', { user: !!data.user, session: !!data.session, error });
    return { data, error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
