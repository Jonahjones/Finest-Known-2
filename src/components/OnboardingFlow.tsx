import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { FinestKnownLogo } from './FinestKnownLogo';
import { useAuth } from '../store/AuthContext';
import { useOnboarding } from '../hooks/useOnboarding';
import { colors, typography, spacing } from '../design/tokens';

export function OnboardingFlow() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signUp, signIn } = useAuth();
  const { completeOnboarding } = useOnboarding();

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (isSignUp && password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password);
        if (error) {
          Alert.alert('Error', error.message);
        } else {
          Alert.alert('Success', 'Account created! Please check your email to verify your account.');
          setIsSignUp(false);
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          Alert.alert('Error', error.message);
        } else {
          await completeOnboarding();
        }
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.logoContainer}>
          <FinestKnownLogo size="large" showText={true} />
        </View>

        <Card style={styles.authCard}>
          <Text style={styles.title}>
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </Text>
          
          <Text style={styles.subtitle}>
            {isSignUp 
              ? 'Join FinestKnown to access premium precious metals' 
              : 'Sign in to continue to your account'
            }
          </Text>

          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}
              autoCapitalize="none"
            />

            {isSignUp && (
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={true}
                autoCapitalize="none"
              />
            )}

            <Button
              title={isSignUp ? 'Create Account' : 'Sign In'}
              onPress={handleAuth}
              loading={loading}
              style={styles.authButton}
            />

            <Button
              title={isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
              onPress={() => setIsSignUp(!isSignUp)}
              variant="ghost"
              style={styles.switchButton}
            />
          </View>
        </Card>

        <View style={styles.features}>
          <Text style={styles.featuresTitle}>Why Choose FinestKnown?</Text>
          <View style={styles.featureList}>
            <Text style={styles.featureItem}>• Real-time precious metals pricing</Text>
            <Text style={styles.featureItem}>• Authentic, certified products</Text>
            <Text style={styles.featureItem}>• Secure transactions</Text>
            <Text style={styles.featureItem}>• Expert market insights</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  
  scrollContent: {
    flexGrow: 1,
    padding: spacing.lg,
  },
  
  logoContainer: {
    alignItems: 'center',
    marginTop: spacing['4xl'],
    marginBottom: spacing['3xl'],
  },
  
  authCard: {
    marginBottom: spacing['3xl'],
  },
  
  title: {
    ...typography.display,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  
  subtitle: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing['2xl'],
  },
  
  form: {
    gap: spacing.lg,
  },
  
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: typography.body.fontSize,
    backgroundColor: colors.background,
  },
  
  authButton: {
    marginTop: spacing.md,
  },
  
  switchButton: {
    marginTop: spacing.sm,
  },
  
  features: {
    alignItems: 'center',
  },
  
  featuresTitle: {
    ...typography.heading,
    color: colors.text.primary,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  
  featureList: {
    alignItems: 'flex-start',
  },
  
  featureItem: {
    ...typography.body,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
});
