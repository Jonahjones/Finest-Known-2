import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../src/store/AuthContext';
import { useTheme } from '../src/theme/ThemeProvider';
import { ThemeToggle } from '../src/components/ThemeToggle';
import { supabase } from '../src/lib/supabase';
import { useOnboardingStore } from '../src/store/onboardingStore';

export default function AuthScreen() {
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [useOfflineMode, setUseOfflineMode] = useState(false);
  const { signIn, signUp } = useAuth();
  const { isLuxeTheme, tokens } = useTheme();
  const { resetOnboarding } = useOnboardingStore();

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    setLoading(true);
    try {
      const { error } = await signIn(email, password);
      if (error) {
        Alert.alert('Error', error.message);
      } else {
        router.replace('/(tabs)');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    
    setLoading(true);
    try {
      const { error } = await signUp(email, password);
      if (error) {
        Alert.alert('Error', error.message);
      } else {
        router.replace('/(tabs)');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };


  const handleTestSSO = async () => {
    setLoading(true);
    try {
      console.log('Starting Test SSO authentication...');
      
      // First test basic connectivity
      console.log('Testing Supabase connectivity...');
      const { data: testData, error: testError } = await supabase.from('profiles').select('id').limit(1);
      
      if (testError) {
        console.log('Supabase connectivity test failed:', testError.message);
        Alert.alert('Connection Error', `Cannot connect to authentication service: ${testError.message}`);
        return;
      }
      
      console.log('Supabase connectivity test passed');
      
      // Now try to sign in with test user
      console.log('Attempting to sign in with test user...');
      const { data: signInData, error: signInError } = await signIn('test@finestknown.com', 'testpassword123');
      
      if (signInError) {
        console.log('Sign in failed, attempting to create new user:', signInError.message);
        
        // If test user doesn't exist, create one
        const { data: signUpData, error: signUpError } = await signUp('test@finestknown.com', 'testpassword123');
        
        if (signUpError) {
          console.error('Sign up error:', signUpError);
          Alert.alert('Authentication Error', `Failed to create test account: ${signUpError.message}`);
        } else {
          console.log('Test account created successfully:', signUpData);
          console.log('User after signup:', signUpData.user);
          console.log('Session after signup:', signUpData.session);
          // Reset onboarding state for new user
          resetOnboarding();
          // Don't navigate - let auth state change handle UI update
          console.log('Signup completed, waiting for auth state change...');
          // Small delay to allow state to propagate
          setTimeout(() => {
            router.replace('/(tabs)');
          }, 500);
        }
      } else {
        console.log('Sign in successful:', signInData);
        console.log('User after signin:', signInData.user);
        console.log('Session after signin:', signInData.session);
        // Reset onboarding state to ensure quiz shows for existing users
        resetOnboarding();
        // Small delay to allow state to propagate
        setTimeout(() => {
          router.replace('/(tabs)');
        }, 500);
        console.log('Signin completed, navigating to app...');
      }
    } catch (error) {
      console.error('Test SSO error:', error);
      
      // Offer offline mode as fallback
      Alert.alert(
        'Network Error', 
        `Failed to connect to authentication service. Would you like to use offline mode for testing?\n\nError: ${error.message || 'Unknown error'}`,
        [
          {
            text: 'Cancel',
            style: 'cancel'
          },
          {
            text: 'Use Offline Mode',
            onPress: async () => {
              try {
                await AsyncStorage.setItem('finestknown_offline_mode', 'true');
                setUseOfflineMode(true);
                Alert.alert('Offline Mode', 'Using offline mode. You will see the onboarding quiz without creating a real account.');
                router.replace('/(tabs)');
              } catch (error) {
                console.error('Failed to set offline mode:', error);
                Alert.alert('Error', 'Failed to enable offline mode. Please try again.');
              }
            }
          }
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSSO = (provider: string) => {
    Alert.alert(
      'SSO Login',
      `This would normally open ${provider} authentication. For testing, this will bypass to onboarding.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Continue', 
          onPress: () => {
            // Navigate to onboarding for testing
            router.replace('/(tabs)');
          }
        }
      ]
    );
  };

  const handleFakeSSO = () => {
    Alert.alert(
      'Fake SSO Login',
      'This bypasses real authentication for testing purposes.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Continue to Onboarding', 
          onPress: () => {
            router.replace('/(tabs)');
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, isLuxeTheme && { backgroundColor: tokens.colors.bg }]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Theme Toggle */}
          <View style={styles.themeToggleContainer}>
            <ThemeToggle />
          </View>

          {/* Back Button */}
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={isLuxeTheme ? tokens.colors.text : "#FFFFFF"} />
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, isLuxeTheme && { color: tokens.colors.text, fontFamily: tokens.typography.display }]}>
              {isSignUp ? 'Create Account' : 'Sign In'}
            </Text>
            <Text style={[styles.subtitle, isLuxeTheme && { color: tokens.colors.muted }]}>
              {isSignUp 
                ? 'Start your precious metals journey' 
                : 'Access your portfolio'
              }
            </Text>
          </View>

          {/* SSO Buttons */}
          <View style={styles.ssoContainer}>
            <Text style={styles.ssoTitle}>Or {isSignUp ? 'Sign Up' : 'Sign In'} with</Text>
            
            {/* Google */}
            <TouchableOpacity 
              style={[styles.ssoButton, styles.googleButton]}
              onPress={() => handleSSO('Google')}
            >
              <Ionicons name="logo-google" size={20} color="#FFFFFF" />
              <Text style={styles.ssoButtonText}>{isSignUp ? 'Sign up with Google' : 'Continue with Google'}</Text>
            </TouchableOpacity>

            {/* Apple */}
            <TouchableOpacity 
              style={[styles.ssoButton, styles.appleButton]}
              onPress={() => handleSSO('Apple')}
            >
              <Ionicons name="logo-apple" size={20} color="#FFFFFF" />
              <Text style={styles.ssoButtonText}>{isSignUp ? 'Sign up with Apple' : 'Continue with Apple'}</Text>
            </TouchableOpacity>

            {/* Facebook */}
            <TouchableOpacity 
              style={[styles.ssoButton, styles.facebookButton]}
              onPress={() => handleSSO('Facebook')}
            >
              <Ionicons name="logo-facebook" size={20} color="#FFFFFF" />
              <Text style={styles.ssoButtonText}>{isSignUp ? 'Sign up with Facebook' : 'Continue with Facebook'}</Text>
            </TouchableOpacity>

            {/* Twitter */}
            <TouchableOpacity 
              style={[styles.ssoButton, styles.twitterButton]}
              onPress={() => handleSSO('Twitter')}
            >
              <Ionicons name="logo-twitter" size={20} color="#FFFFFF" />
              <Text style={styles.ssoButtonText}>{isSignUp ? 'Sign up with Twitter' : 'Continue with Twitter'}</Text>
            </TouchableOpacity>

          </View>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Email/Password Form */}
          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#666666"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor="#666666"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
              />
            </View>

            {isSignUp && (
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Confirm Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Confirm your password"
                  placeholderTextColor="#666666"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  autoCapitalize="none"
                />
              </View>
            )}

            <TouchableOpacity 
              style={[styles.primaryButton, loading && styles.primaryButtonDisabled]}
              onPress={isSignUp ? handleSignUp : handleSignIn}
              disabled={loading}
            >
              <Text style={styles.primaryButtonText}>
                {loading ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Sign In')}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Toggle Sign In/Sign Up */}
          <View style={styles.toggleContainer}>
            <Text style={styles.toggleText}>
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            </Text>
            <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
              <Text style={styles.toggleLink}>
                {isSignUp ? 'Sign In Instead' : 'Sign Up Instead'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Test SSO for Testing - At Bottom */}
          <TouchableOpacity 
            style={[styles.ssoButton, styles.fakeButton]}
            onPress={handleTestSSO}
            disabled={loading}
          >
            <Ionicons name="flash" size={20} color="#FFFFFF" />
            <Text style={styles.ssoButtonText}>
              {loading ? '🔄 Testing SSO...' : '🚀 Test SSO'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  themeToggleContainer: {
    position: 'absolute',
    top: 10,
    right: 24,
    zIndex: 10,
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 24,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    paddingTop: 10,
    paddingBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#CCCCCC',
    lineHeight: 26,
    textAlign: 'center',
    maxWidth: 300,
  },
  ssoContainer: {
    marginBottom: 24,
  },
  ssoTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#CCCCCC',
    marginBottom: 16,
    textAlign: 'center',
  },
  ssoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginBottom: 12,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  googleButton: {
    backgroundColor: '#DB4437',
  },
  appleButton: {
    backgroundColor: '#000000',
  },
  facebookButton: {
    backgroundColor: '#4267B2',
  },
  twitterButton: {
    backgroundColor: '#1DA1F2',
  },
  fakeButton: {
    backgroundColor: '#00D4AA',
    marginTop: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#00B894',
  },
  ssoButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#333333',
  },
  dividerText: {
    color: '#666666',
    fontSize: 16,
    marginHorizontal: 20,
    fontWeight: '500',
  },
  formContainer: {
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 20,
    fontSize: 17,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#333333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  primaryButton: {
    backgroundColor: '#00D4AA',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#00D4AA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryButtonDisabled: {
    backgroundColor: '#666666',
    shadowOpacity: 0,
    elevation: 0,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
    paddingTop: 12,
  },
  toggleText: {
    color: '#CCCCCC',
    fontSize: 16,
    marginRight: 8,
  },
  toggleLink: {
    color: '#00D4AA',
    fontSize: 16,
    fontWeight: '700',
  },
});
