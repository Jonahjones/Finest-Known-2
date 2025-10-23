import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface RealtimeContextType {
  subscribe: (channel: string, callback: (data: any) => void) => void;
  unsubscribe: (channel: string, callback: (data: any) => void) => void;
}

const RealtimeContext = createContext<RealtimeContextType | undefined>(undefined);

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const [subscriptions, setSubscriptions] = useState<Map<string, any>>(new Map());

  const subscribe = (channel: string, callback: (data: any) => void) => {
    const subscription = supabase
      .channel(channel)
      .on('postgres_changes', { event: '*', schema: 'public', table: channel }, callback)
      .subscribe();

    setSubscriptions(prev => new Map(prev.set(channel, subscription)));
  };

  const unsubscribe = (channel: string, callback: (data: any) => void) => {
    const subscription = subscriptions.get(channel);
    if (subscription) {
      subscription.unsubscribe();
      setSubscriptions(prev => {
        const newMap = new Map(prev);
        newMap.delete(channel);
        return newMap;
      });
    }
  };

  useEffect(() => {
    return () => {
      // Cleanup all subscriptions on unmount
      subscriptions.forEach(subscription => {
        subscription.unsubscribe();
      });
    };
  }, []);

  const value = {
    subscribe,
    unsubscribe,
  };

  return (
    <RealtimeContext.Provider value={value}>
      {children}
    </RealtimeContext.Provider>
  );
}

export function useRealtime() {
  const context = useContext(RealtimeContext);
  if (context === undefined) {
    throw new Error('useRealtime must be used within a RealtimeProvider');
  }
  return context;
}
