import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface HamburgerMenuProps {
  visible: boolean;
  onClose: () => void;
  onAccountPress?: () => void;
  onCartPress?: () => void;
  onSignInPress?: () => void;
  isLoggedIn?: boolean;
  cartItemCount?: number;
}

export function HamburgerMenu({
  visible,
  onClose,
  onAccountPress,
  onCartPress,
  onSignInPress,
  isLoggedIn = false,
  cartItemCount = 0,
}: HamburgerMenuProps) {
  const slideAnim = React.useRef(new Animated.Value(screenWidth)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: screenWidth,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim]);

  const menuItems = [
    {
      id: 'account',
      title: 'Account',
      icon: 'person-outline',
      onPress: onAccountPress,
      show: isLoggedIn,
    },
    {
      id: 'cart',
      title: 'Cart',
      icon: 'cart-outline',
      onPress: onCartPress,
      show: true,
      badge: cartItemCount > 0 ? cartItemCount : undefined,
    },
    {
      id: 'signin',
      title: isLoggedIn ? 'Sign Out' : 'Sign In / Sign Up',
      icon: isLoggedIn ? 'log-out-outline' : 'person-add-outline',
      onPress: onSignInPress,
      show: true,
    },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />
        <Animated.View
          style={[
            styles.menuContainer,
            {
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >
          <View style={styles.menuHeader}>
            <Text style={styles.menuTitle}>Menu</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.menuContent}>
            {menuItems.map((item) => {
              if (!item.show) return null;
              
              return (
                <TouchableOpacity
                  key={item.id}
                  style={styles.menuItem}
                  onPress={() => {
                    item.onPress?.();
                    onClose();
                  }}
                >
                  <View style={styles.menuItemLeft}>
                    <Ionicons name={item.icon as any} size={24} color="#FFFFFF" />
                    <Text style={styles.menuItemText}>{item.title}</Text>
                  </View>
                  {item.badge && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{item.badge}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  backdrop: {
    flex: 1,
  },
  menuContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 280,
    height: 'auto',
    maxHeight: screenHeight * 0.6,
    backgroundColor: '#1a1a1a',
    borderLeftWidth: 1,
    borderLeftColor: '#333333',
    borderRadius: 12,
    margin: 12,
    marginTop: 60, // Account for status bar
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  closeButton: {
    padding: 8,
  },
  menuContent: {
    paddingVertical: 8,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 12,
    marginVertical: 2,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuItemText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  badge: {
    backgroundColor: '#00D4AA',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
