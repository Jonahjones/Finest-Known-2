import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '../../src/theme/ThemeProvider';
import { useAuth } from '../../src/store/AuthContext';
import { supabase } from '../../src/lib/supabase';
import { colors, spacing, typography } from '../../src/design/tokens';

export default function AccountScreen() {
  const { isLuxeTheme, tokens } = useTheme();
  const { user, signOut } = useAuth();
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleUpdatePassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      Alert.alert('Invalid Password', 'Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Password Mismatch', 'New password and confirmation do not match.');
      return;
    }

    setLoading(true);

    try {
      // Update password using Supabase
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        throw error;
      }

      Alert.alert('Success', 'Your password has been updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Password update error:', error);
      Alert.alert('Error', 'Failed to update password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await signOut();
            router.replace('/(tabs)');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, isLuxeTheme && { backgroundColor: tokens.colors.bg }]} edges={['bottom']}>
      <View style={[styles.header, isLuxeTheme && { backgroundColor: tokens.colors.bgElev }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={isLuxeTheme ? tokens.colors.text : "#000"} />
        </TouchableOpacity>
        <Text style={[styles.title, isLuxeTheme && { color: tokens.colors.text }]}>Account</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Profile Section */}
        <View style={[styles.section, isLuxeTheme && { backgroundColor: tokens.colors.bgElev }]}>
          <Text style={[styles.sectionTitle, isLuxeTheme && { color: tokens.colors.text }]}>
            Profile
          </Text>

          <View style={styles.profileRow}>
            <View style={styles.profileIcon}>
              <Ionicons 
                name="person" 
                size={32} 
                color={isLuxeTheme ? tokens.colors.gold : "#00D4AA"} 
              />
            </View>
            <View style={styles.profileInfo}>
              <Text style={[styles.profileName, isLuxeTheme && { color: tokens.colors.text }]}>
                {user?.email?.split('@')[0] || 'User'}
              </Text>
              <Text style={[styles.profileEmail, isLuxeTheme && { color: tokens.colors.muted }]}>
                {email}
              </Text>
            </View>
          </View>
        </View>

        {/* Account Information */}
        <View style={[styles.section, isLuxeTheme && { backgroundColor: tokens.colors.bgElev }]}>
          <Text style={[styles.sectionTitle, isLuxeTheme && { color: tokens.colors.text }]}>
            Account Information
          </Text>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, isLuxeTheme && { color: tokens.colors.muted }]}>
              Email Address
            </Text>
            <TextInput
              style={[styles.input, isLuxeTheme && { backgroundColor: tokens.colors.surface, color: tokens.colors.text, borderColor: tokens.colors.line }]}
              value={email}
              editable={false}
              placeholder="Email address"
              placeholderTextColor={isLuxeTheme ? tokens.colors.muted : "#999"}
            />
            <Text style={[styles.inputHint, isLuxeTheme && { color: tokens.colors.muted }]}>
              Email cannot be changed
            </Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, isLuxeTheme && { color: tokens.colors.muted }]}>
              User ID
            </Text>
            <TextInput
              style={[styles.input, isLuxeTheme && { backgroundColor: tokens.colors.surface, color: tokens.colors.muted, borderColor: tokens.colors.line }]}
              value={user?.id || ''}
              editable={false}
              placeholder="User ID"
              placeholderTextColor={isLuxeTheme ? tokens.colors.muted : "#999"}
            />
          </View>
        </View>

        {/* Change Password */}
        <View style={[styles.section, isLuxeTheme && { backgroundColor: tokens.colors.bgElev }]}>
          <Text style={[styles.sectionTitle, isLuxeTheme && { color: tokens.colors.text }]}>
            Change Password
          </Text>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, isLuxeTheme && { color: tokens.colors.muted }]}>
              Current Password
            </Text>
            <TextInput
              style={[styles.input, isLuxeTheme && { backgroundColor: tokens.colors.surface, color: tokens.colors.text, borderColor: tokens.colors.line }]}
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry
              placeholder="Enter current password"
              placeholderTextColor={isLuxeTheme ? tokens.colors.muted : "#999"}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, isLuxeTheme && { color: tokens.colors.muted }]}>
              New Password
            </Text>
            <TextInput
              style={[styles.input, isLuxeTheme && { backgroundColor: tokens.colors.surface, color: tokens.colors.text, borderColor: tokens.colors.line }]}
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              placeholder="Enter new password (min 6 characters)"
              placeholderTextColor={isLuxeTheme ? tokens.colors.muted : "#999"}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, isLuxeTheme && { color: tokens.colors.muted }]}>
              Confirm New Password
            </Text>
            <TextInput
              style={[styles.input, isLuxeTheme && { backgroundColor: tokens.colors.surface, color: tokens.colors.text, borderColor: tokens.colors.line }]}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              placeholder="Confirm new password"
              placeholderTextColor={isLuxeTheme ? tokens.colors.muted : "#999"}
            />
          </View>

          <TouchableOpacity
            style={[styles.updateButton, isLuxeTheme && { backgroundColor: tokens.colors.gold }]}
            onPress={handleUpdatePassword}
            disabled={loading}
          >
            <Text style={[styles.updateButtonText, isLuxeTheme && { color: tokens.colors.bg }]}>
              {loading ? 'Updating...' : 'Update Password'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Notifications */}
        <View style={[styles.section, isLuxeTheme && { backgroundColor: tokens.colors.bgElev }]}>
          <Text style={[styles.sectionTitle, isLuxeTheme && { color: tokens.colors.text }]}>
            Notifications
          </Text>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Ionicons 
                name="notifications-outline" 
                size={24} 
                color={isLuxeTheme ? tokens.colors.text : "#000"} 
              />
              <View style={styles.settingText}>
                <Text style={[styles.settingTitle, isLuxeTheme && { color: tokens.colors.text }]}>
                  Push Notifications
                </Text>
                <Text style={[styles.settingDescription, isLuxeTheme && { color: tokens.colors.muted }]}>
                  Receive push notifications on your device
                </Text>
              </View>
            </View>
            <Switch
              value={pushNotifications}
              onValueChange={setPushNotifications}
              trackColor={{ false: '#767577', true: isLuxeTheme ? tokens.colors.gold : '#00D4AA' }}
              thumbColor={pushNotifications ? '#FFFFFF' : '#f4f3f4'}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Ionicons 
                name="mail-outline" 
                size={24} 
                color={isLuxeTheme ? tokens.colors.text : "#000"} 
              />
              <View style={styles.settingText}>
                <Text style={[styles.settingTitle, isLuxeTheme && { color: tokens.colors.text }]}>
                  Email Notifications
                </Text>
                <Text style={[styles.settingDescription, isLuxeTheme && { color: tokens.colors.muted }]}>
                  Receive email notifications about your account
                </Text>
              </View>
            </View>
            <Switch
              value={emailNotifications}
              onValueChange={setEmailNotifications}
              trackColor={{ false: '#767577', true: isLuxeTheme ? tokens.colors.gold : '#00D4AA' }}
              thumbColor={emailNotifications ? '#FFFFFF' : '#f4f3f4'}
            />
          </View>
        </View>

        {/* Sign Out */}
        <View style={styles.signOutSection}>
          <TouchableOpacity
            style={[styles.signOutButton, isLuxeTheme && { backgroundColor: tokens.colors.danger }]}
            onPress={handleSignOut}
          >
            <Ionicons name="log-out-outline" size={20} color="#FFFFFF" />
            <Text style={styles.signOutButtonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
  },
  section: {
    margin: 20,
    marginBottom: 20,
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 20,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#00D4AA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#6B7280',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
  inputHint: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  updateButton: {
    backgroundColor: '#00D4AA',
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  updateButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 12,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  signOutSection: {
    margin: 20,
    marginBottom: 40,
  },
  signOutButton: {
    backgroundColor: '#FF5A5A',
    height: 56,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  signOutButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

