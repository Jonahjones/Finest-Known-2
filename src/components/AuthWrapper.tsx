import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useAuth } from '../store/AuthContext';
import { useOnboarding } from '../hooks/useOnboarding';
import { OnboardingFlow } from './OnboardingFlow';
import { colors } from '../design/tokens';

interface AuthWrapperProps {
  children: React.ReactNode;
}

export function AuthWrapper({ children }: AuthWrapperProps) {
  const { user, loading: authLoading } = useAuth();
  const { hasCompletedOnboarding, isLoading: onboardingLoading } = useOnboarding();

  // Show loading screen while checking auth and onboarding status
  if (authLoading || onboardingLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  // Show onboarding if user is authenticated but hasn't completed onboarding
  if (user && !hasCompletedOnboarding) {
    return <OnboardingFlow />;
  }

  // Show main app - no authentication required
  return <>{children}</>;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});
