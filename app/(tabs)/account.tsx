import React, { useState, useEffect } from 'react';
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
import { getUserProfile, updateUserProfile, UserProfile } from '../../src/api/profile';
import { getUserAddresses, addAddress, deleteAddress, Address } from '../../src/api/addresses';
import { getUserOrders } from '../../src/api/checkout';

export default function AccountScreen() {
  const { isLuxeTheme: isLuxeThemeRaw, tokens } = useTheme();
  // Ensure boolean type to prevent Java casting errors on React Native bridge
  const isLuxeTheme = Boolean(isLuxeThemeRaw);
  const { user, signOut } = useAuth();
  const [email, setEmail] = useState(user?.email || '');
  const [displayName, setDisplayName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (user) {
        try {
          const userProfile = await getUserProfile();
          if (userProfile) {
            setProfile(userProfile);
            setDisplayName(userProfile.display_name || '');
            setFirstName(userProfile.first_name || '');
            setLastName(userProfile.last_name || '');
            setPhoneNumber(userProfile.phone_number || '');
          }
          
          const userAddresses = await getUserAddresses();
          setAddresses(userAddresses);

          // Fetch user orders
          const userOrders = await getUserOrders();
          setOrders(userOrders);
        } catch (error) {
          console.error('Error fetching profile data:', error);
        }
      }
    };
    fetchProfileData();
  }, [user]);

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      await updateUserProfile({
        display_name: displayName,
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber,
      });
      Alert.alert('Success', 'Your profile has been updated successfully.');
    } catch (error) {
      console.error('Profile update error:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
    <SafeAreaView style={[styles.container, isLuxeTheme ? { backgroundColor: tokens.colors.bg } : null]}>
      <View style={[styles.header, isLuxeTheme ? { backgroundColor: tokens.colors.bgElev } : null]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={isLuxeTheme ? tokens.colors.text : "#000"} />
        </TouchableOpacity>
        <Text style={[styles.title, isLuxeTheme ? { color: tokens.colors.text } : null]}>Account</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Profile Section */}
        <View style={[styles.section, isLuxeTheme ? { backgroundColor: tokens.colors.bgElev } : null]}>
          <Text style={[styles.sectionTitle, isLuxeTheme ? { color: tokens.colors.text } : null]}>
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
              <Text style={[styles.profileName, isLuxeTheme ? { color: tokens.colors.text } : null]}>
                {displayName || firstName || lastName || user?.email?.split('@')[0] || 'User'}
              </Text>
              <Text style={[styles.profileEmail, isLuxeTheme ? { color: tokens.colors.muted } : null]}>
                {email}
              </Text>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, isLuxeTheme ? { color: tokens.colors.muted } : null]}>
              Display Name
            </Text>
            <TextInput
              style={[styles.input, isLuxeTheme ? { backgroundColor: tokens.colors.surface, color: tokens.colors.text, borderColor: tokens.colors.line } : null]}
              value={displayName}
              onChangeText={setDisplayName}
              placeholder="Enter display name"
              placeholderTextColor={isLuxeTheme ? tokens.colors.muted : "#999"}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, isLuxeTheme ? { color: tokens.colors.muted } : null]}>
              First Name
            </Text>
            <TextInput
              style={[styles.input, isLuxeTheme ? { backgroundColor: tokens.colors.surface, color: tokens.colors.text, borderColor: tokens.colors.line } : null]}
              value={firstName}
              onChangeText={setFirstName}
              placeholder="Enter first name"
              placeholderTextColor={isLuxeTheme ? tokens.colors.muted : "#999"}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, isLuxeTheme ? { color: tokens.colors.muted } : null]}>
              Last Name
            </Text>
            <TextInput
              style={[styles.input, isLuxeTheme ? { backgroundColor: tokens.colors.surface, color: tokens.colors.text, borderColor: tokens.colors.line } : null]}
              value={lastName}
              onChangeText={setLastName}
              placeholder="Enter last name"
              placeholderTextColor={isLuxeTheme ? tokens.colors.muted : "#999"}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, isLuxeTheme ? { color: tokens.colors.muted } : null]}>
              Phone Number
            </Text>
            <TextInput
              style={[styles.input, isLuxeTheme ? { backgroundColor: tokens.colors.surface, color: tokens.colors.text, borderColor: tokens.colors.line } : null]}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholder="Enter phone number"
              placeholderTextColor={isLuxeTheme ? tokens.colors.muted : "#999"}
              keyboardType="phone-pad"
            />
          </View>

          <TouchableOpacity
            style={[styles.updateButton, isLuxeTheme ? { backgroundColor: tokens.colors.gold } : null]}
            onPress={handleUpdateProfile}
            disabled={Boolean(loading)}
          >
            <Text style={[styles.updateButtonText, isLuxeTheme ? { color: tokens.colors.bg } : null]}>
              {loading ? 'Updating...' : 'Update Profile'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Account Information */}
        <View style={[styles.section, isLuxeTheme ? { backgroundColor: tokens.colors.bgElev } : null]}>
          <Text style={[styles.sectionTitle, isLuxeTheme ? { color: tokens.colors.text } : null]}>
            Account Information
          </Text>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, isLuxeTheme ? { color: tokens.colors.muted } : null]}>
              Email Address
            </Text>
            <TextInput
              style={[styles.input, isLuxeTheme ? { backgroundColor: tokens.colors.surface, color: tokens.colors.text, borderColor: tokens.colors.line } : null]}
              value={email}
              editable={false}
              placeholder="Email address"
              placeholderTextColor={isLuxeTheme ? tokens.colors.muted : "#999"}
            />
            <Text style={[styles.inputHint, isLuxeTheme ? { color: tokens.colors.muted } : null]}>
              Email cannot be changed
            </Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, isLuxeTheme ? { color: tokens.colors.muted } : null]}>
              User ID
            </Text>
            <TextInput
              style={[styles.input, isLuxeTheme ? { backgroundColor: tokens.colors.surface, color: tokens.colors.muted, borderColor: tokens.colors.line } : null]}
              value={user?.id || ''}
              editable={false}
              placeholder="User ID"
              placeholderTextColor={isLuxeTheme ? tokens.colors.muted : "#999"}
            />
          </View>
        </View>

        {/* Change Password */}
        <View style={[styles.section, isLuxeTheme ? { backgroundColor: tokens.colors.bgElev } : null]}>
          <Text style={[styles.sectionTitle, isLuxeTheme ? { color: tokens.colors.text } : null]}>
            Change Password
          </Text>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, isLuxeTheme ? { color: tokens.colors.muted } : null]}>
              Current Password
            </Text>
            <TextInput
              style={[styles.input, isLuxeTheme ? { backgroundColor: tokens.colors.surface, color: tokens.colors.text, borderColor: tokens.colors.line } : null]}
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry
              placeholder="Enter current password"
              placeholderTextColor={isLuxeTheme ? tokens.colors.muted : "#999"}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, isLuxeTheme ? { color: tokens.colors.muted } : null]}>
              New Password
            </Text>
            <TextInput
              style={[styles.input, isLuxeTheme ? { backgroundColor: tokens.colors.surface, color: tokens.colors.text, borderColor: tokens.colors.line } : null]}
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              placeholder="Enter new password (min 6 characters)"
              placeholderTextColor={isLuxeTheme ? tokens.colors.muted : "#999"}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, isLuxeTheme ? { color: tokens.colors.muted } : null]}>
              Confirm New Password
            </Text>
            <TextInput
              style={[styles.input, isLuxeTheme ? { backgroundColor: tokens.colors.surface, color: tokens.colors.text, borderColor: tokens.colors.line } : null]}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              placeholder="Confirm new password"
              placeholderTextColor={isLuxeTheme ? tokens.colors.muted : "#999"}
            />
          </View>

          <TouchableOpacity
            style={[styles.updateButton, isLuxeTheme ? { backgroundColor: tokens.colors.gold } : null]}
            onPress={handleUpdatePassword}
            disabled={Boolean(loading)}
          >
            <Text style={[styles.updateButtonText, isLuxeTheme ? { color: tokens.colors.bg } : null]}>
              {loading ? 'Updating...' : 'Update Password'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Notifications */}
        <View style={[styles.section, isLuxeTheme ? { backgroundColor: tokens.colors.bgElev } : null]}>
          <Text style={[styles.sectionTitle, isLuxeTheme ? { color: tokens.colors.text } : null]}>
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
                <Text style={[styles.settingTitle, isLuxeTheme ? { color: tokens.colors.text } : null]}>
                  Push Notifications
                </Text>
                <Text style={[styles.settingDescription, isLuxeTheme ? { color: tokens.colors.muted } : null]}>
                  Receive push notifications on your device
                </Text>
              </View>
            </View>
            <Switch
              value={Boolean(pushNotifications)}
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
                <Text style={[styles.settingTitle, isLuxeTheme ? { color: tokens.colors.text } : null]}>
                  Email Notifications
                </Text>
                <Text style={[styles.settingDescription, isLuxeTheme ? { color: tokens.colors.muted } : null]}>
                  Receive email notifications about your account
                </Text>
              </View>
            </View>
            <Switch
              value={Boolean(emailNotifications)}
              onValueChange={setEmailNotifications}
              trackColor={{ false: '#767577', true: isLuxeTheme ? tokens.colors.gold : '#00D4AA' }}
              thumbColor={emailNotifications ? '#FFFFFF' : '#f4f3f4'}
            />
          </View>
        </View>

        {/* Orders / Portfolio */}
        <View style={[styles.section, isLuxeTheme ? { backgroundColor: tokens.colors.bgElev } : null]}>
          <Text style={[styles.sectionTitle, isLuxeTheme ? { color: tokens.colors.text } : null]}>
            Portfolio & Orders
          </Text>

          {ordersLoading ? (
            <Text style={[styles.emptyText, isLuxeTheme ? { color: tokens.colors.muted } : null]}>
              Loading orders...
            </Text>
          ) : orders.length === 0 ? (
            <Text style={[styles.emptyText, isLuxeTheme ? { color: tokens.colors.muted } : null]}>
              You haven't made any purchases yet.
            </Text>
          ) : (
            orders.map((order) => (
              <View key={order.id} style={styles.orderCard}>
                <View style={styles.orderHeader}>
                  <View>
                    <Text style={[styles.orderNumber, isLuxeTheme ? { color: tokens.colors.text } : null]}>
                      Order #{order.id.slice(0, 8)}
                    </Text>
                    <Text style={[styles.orderDate, isLuxeTheme ? { color: tokens.colors.muted } : null]}>
                      {new Date(order.created_at).toLocaleDateString()}
                    </Text>
                  </View>
                  <View style={[styles.statusBadge, order.status === 'confirmed' && styles.confirmedBadge]}>
                    <Text style={styles.statusText}>{order.status.toUpperCase()}</Text>
                  </View>
                </View>

                {order.order_items?.map((item: any, index: number) => (
                  <View key={item.id || index} style={styles.orderItem}>
                    <View style={styles.orderItemInfo}>
                      <Text style={[styles.orderItemTitle, isLuxeTheme ? { color: tokens.colors.text } : null]}>
                        {item.product?.title || 'Product'}
                      </Text>
                      <Text style={[styles.orderItemDetails, isLuxeTheme ? { color: tokens.colors.muted } : null]}>
                        Qty: {item.quantity} × {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format((item.price_cents || 0) / 100)}
                      </Text>
                    </View>
                  </View>
                ))}

                <View style={styles.orderTotal}>
                  <Text style={[styles.orderTotalLabel, isLuxeTheme ? { color: tokens.colors.text } : null]}>
                    Total:
                  </Text>
                  <Text style={[styles.orderTotalValue, isLuxeTheme ? { color: tokens.colors.gold } : null]}>
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format((order.total_cents || 0) / 100)}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Sign Out */}
        <View style={styles.signOutSection}>
          <TouchableOpacity
            style={[styles.signOutButton, isLuxeTheme ? { backgroundColor: tokens.colors.danger } : null]}
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
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginVertical: 20,
  },
  orderCard: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  orderDate: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: '#E5E7EB',
  },
  confirmedBadge: {
    backgroundColor: '#00D4AA',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#000000',
  },
  orderItem: {
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  orderItemInfo: {
    flex: 1,
  },
  orderItemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  orderItemDetails: {
    fontSize: 12,
    color: '#6B7280',
  },
  orderTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  orderTotalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  orderTotalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00D4AA',
  },
});

