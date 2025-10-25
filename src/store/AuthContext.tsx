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
  checkSession: () => Promise<{ session: Session | null; error: any }>;
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
    
    // Initialize auth state
    const initializeAuth = async () => {
      try {
        // Get initial session
        const { data: { session }, error } = await supabase.auth.getSession();
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
        
        // If no session, try to refresh
        if (!session && !error) {
          console.log('AuthContext: No session found, attempting refresh...');
          const { data: { session: refreshedSession }, error: refreshError } = await supabase.auth.refreshSession();
          if (refreshedSession) {
            console.log('AuthContext: Session refreshed successfully');
            setSession(refreshedSession);
            setUser(refreshedSession.user);
          } else {
            console.log('AuthContext: Refresh failed:', refreshError);
          }
        }
      } catch (err) {
        console.error('AuthContext: Initialization error:', err);
        setLoading(false);
      }
    };

    initializeAuth();

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
    
    // If successful, ensure session is properly set
    if (data.session && data.user) {
      console.log('AuthContext: Setting session after signup');
      setSession(data.session);
      setUser(data.user);
    }
    
    return { data, error };
  };

  const signIn = async (email: string, password: string) => {
    console.log('AuthContext: signIn called with:', email);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    console.log('AuthContext: signIn result:', { user: !!data.user, session: !!data.session, error });
    
    // If successful, ensure session is properly set
    if (data.session && data.user) {
      console.log('AuthContext: Setting session after signin');
      setSession(data.session);
      setUser(data.user);
    }
    
    return { data, error };
  };

  const signOut = async () => {
    console.log('AuthContext: Signing out...');
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
  };

  const checkSession = async () => {
    console.log('AuthContext: Manual session check...');
    const { data: { session }, error } = await supabase.auth.getSession();
    console.log('AuthContext: Manual session check result:', { 
      session: !!session, 
      user: !!session?.user, 
      userId: session?.user?.id,
      error 
    });
    setSession(session);
    setUser(session?.user ?? null);
    return { session, error };
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
    checkSession,
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
