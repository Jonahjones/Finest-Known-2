import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { OnboardingFlow } from './onboarding/OnboardingFlow';
import { ConversionModal } from './ConversionModal';
import { useAuth } from '../store/AuthContext';
import { useOnboardingStore, PersonaType } from '../store/onboardingStore';
import { router } from 'expo-router';

export function AppFlow() {
  const [showConversionModal, setShowConversionModal] = useState(false);
  const [conversionAction, setConversionAction] = useState<'save' | 'bid' | 'checkout'>('save');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const { user, session, loading: authLoading } = useAuth();
  const { isCompleted, isSkipped, persona, startOnboarding } = useOnboardingStore();

  // Show onboarding for authenticated users who haven't completed it
  const shouldShowOnboarding = user && !isCompleted && !isSkipped;

  // Debug logging
  console.log('AppFlow - user:', !!user, 'user ID:', user?.id);
  console.log('AppFlow - isCompleted:', isCompleted, 'isSkipped:', isSkipped);
  console.log('AppFlow - shouldShowOnboarding:', shouldShowOnboarding);

  // Auto-start onboarding for new authenticated users
  useEffect(() => {
    if (user && !isCompleted && !isSkipped) {
      startOnboarding();
    }
  }, [user, isCompleted, isSkipped, startOnboarding]);

  const handleOnboardingComplete = (assignedPersona: string) => {
    console.log('Onboarding completed with persona:', assignedPersona);
    console.log('User authenticated:', !!user);
    console.log('User ID:', user?.id);
    console.log('Session exists:', !!session);
    console.log('Auth loading:', authLoading);
    // Analytics: onboarding_complete
    // Analytics: persona_assigned
  };

  const handleOnboardingSkip = () => {
    console.log('Onboarding skipped');
    // Analytics: onboarding_skipped
  };

  const handleItemPress = (item: any) => {
    // Navigate to item detail page
    router.push(`/item/${item.id}`);
  };

  const handleCategoryPress = (category: any) => {
    // Navigate to category page
    router.push(`/catalog?category=${category.slug}`);
  };

  const handleConversionTrigger = (action: 'save' | 'bid' | 'checkout', item?: any) => {
    setConversionAction(action);
    setSelectedItem(item);
    setShowConversionModal(true);
    
    // Analytics: conversion_modal_opened
    console.log(`Conversion modal opened for ${action}`, item);
  };

  const handleSignUp = () => {
    setShowConversionModal(false);
    router.push('/auth?mode=signup');
  };

  const handleSignIn = () => {
    setShowConversionModal(false);
    router.push('/auth?mode=signin');
  };

  const handleCloseConversion = () => {
    setShowConversionModal(false);
    setSelectedItem(null);
  };

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <View style={styles.container}>
        {/* Loading state */}
      </View>
    );
  }

  // Show onboarding for authenticated users who haven't completed it
  if (shouldShowOnboarding) {
    return (
      <View style={styles.fullScreenOverlay}>
        <OnboardingFlow
          onComplete={handleOnboardingComplete}
          onSkip={handleOnboardingSkip}
        />
      </View>
    );
  }

  // For authenticated users who have completed onboarding, show the main app tabs
  // For unauthenticated users, show the main app tabs (they'll see the landing page)
  // The tabs will handle showing the appropriate content
  return null; // Let the Stack navigation handle the main app
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  fullScreenOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    backgroundColor: '#000000',
  },
});

