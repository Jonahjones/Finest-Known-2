import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useOnboardingStore } from '../store/onboardingStore';

export interface GuestSession {
  sessionId: string;
  createdAt: number;
  expiresAt: number;
  isActive: boolean;
}

const GUEST_SESSION_KEY = 'finestknown_guest_session';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export function useGuestSession() {
  const [session, setSession] = useState<GuestSession | null>(null);
  const { isCompleted, isSkipped, persona } = useOnboardingStore();

  // Initialize or restore guest session
  useEffect(() => {
    const initializeSession = async () => {
      try {
        const storedSession = await AsyncStorage.getItem(GUEST_SESSION_KEY);
        
        if (storedSession) {
          const parsedSession = JSON.parse(storedSession);
          const now = Date.now();
          
          // Check if session is still valid
          if (parsedSession.expiresAt > now) {
            setSession({
              ...parsedSession,
              isActive: true
            });
            return;
          }
        }

        // Create new guest session
        const newSession: GuestSession = {
          sessionId: `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          createdAt: Date.now(),
          expiresAt: Date.now() + SESSION_DURATION,
          isActive: true
        };

        setSession(newSession);
        await AsyncStorage.setItem(GUEST_SESSION_KEY, JSON.stringify(newSession));
      } catch (error) {
        console.warn('Failed to initialize guest session:', error);
        // Create a basic session even if storage fails
        const newSession: GuestSession = {
          sessionId: `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          createdAt: Date.now(),
          expiresAt: Date.now() + SESSION_DURATION,
          isActive: true
        };
        setSession(newSession);
      }
    };

    initializeSession();
  }, []);

  // Update session activity
  const updateSession = async () => {
    if (session) {
      const updatedSession = {
        ...session,
        expiresAt: Date.now() + SESSION_DURATION
      };
      setSession(updatedSession);
      try {
        await AsyncStorage.setItem(GUEST_SESSION_KEY, JSON.stringify(updatedSession));
      } catch (error) {
        console.warn('Failed to update session:', error);
      }
    }
  };

  // Clear session
  const clearSession = async () => {
    setSession(null);
    try {
      await AsyncStorage.removeItem(GUEST_SESSION_KEY);
    } catch (error) {
      console.warn('Failed to clear session:', error);
    }
  };

  // Check if user should see onboarding
  const shouldShowOnboarding = !isCompleted && !isSkipped;

  // Check if user is ready for personalized experience
  const isReadyForPersonalization = isCompleted || isSkipped;

  return {
    session,
    updateSession,
    clearSession,
    shouldShowOnboarding,
    isReadyForPersonalization,
    persona
  };
}

