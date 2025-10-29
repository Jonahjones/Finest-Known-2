import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  StatusBar,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { getLivePrices, refreshLivePrices } from '../api/livePrices';
import { LivePrice } from '../api/types';
import { HamburgerMenu } from './HamburgerMenu';
import { useCartItemCount } from '../hooks/useCart';
import { router } from 'expo-router';
import { useAuth } from '../store/AuthContext';

const { width: screenWidth } = Dimensions.get('window');

interface LivePricesTickerProps {
  onPricePress?: (metal: string) => void;
}

export function LivePricesTicker({ onPricePress }: LivePricesTickerProps) {
  const [prices, setPrices] = useState<LivePrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);
  const cartItemCount = useCartItemCount();
  const { user, session, signOut: handleSignOut } = useAuth();
  const [userName, setUserName] = React.useState<string>('');

  React.useEffect(() => {
    const fetchUserName = async () => {
      if (user) {
        try {
          const { getUserProfile } = await import('../api/profile');
          const profile = await getUserProfile();
          if (profile) {
            const name = profile.display_name || 
                        (profile.first_name && profile.last_name ? `${profile.first_name} ${profile.last_name}` : null) ||
                        user.email?.split('@')[0] || 
                        'User';
            setUserName(name);
          } else {
            setUserName(user.email?.split('@')[0] || 'User');
          }
        } catch (error) {
          setUserName(user.email?.split('@')[0] || 'User');
        }
      } else {
        setUserName('');
      }
    };
    fetchUserName();
  }, [user]);
  const animatedValue = React.useRef(new Animated.Value(0)).current;

  const loadPrices = async () => {
    try {
      const livePrices = await getLivePrices();
      setPrices(livePrices);
    } catch (error) {
      console.error('Error loading live prices for ticker:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const livePrices = await refreshLivePrices();
      setPrices(livePrices);
    } catch (error) {
      console.error('Error refreshing live prices:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPrices();
    
    // Refresh prices every 2 hours for more accurate percentage changes
    const interval = setInterval(loadPrices, 2 * 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll animation with seamless loop
  useEffect(() => {
    if (prices.length === 0) return;

    const itemWidth = 200; // Width of each price item
    const totalWidth = prices.length * itemWidth; // Width of single set
    
    // Reset to 0 when reaching the end for seamless loop
    const startAnimation = () => {
      animatedValue.setValue(0);
      
      Animated.loop(
        Animated.timing(animatedValue, {
          toValue: totalWidth,
          duration: 30000, // 30 seconds for full loop (slower)
          useNativeDriver: true,
        })
      ).start();
    };

    startAnimation();
  }, [prices, animatedValue]);

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  const formatChange = (change: number, changePercent: number) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${changePercent.toFixed(2)}%`;
  };

  const getChangeColor = (change: number) => {
    return change >= 0 ? '#10B981' : '#EF4444';
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading live prices...</Text>
        </View>
      </View>
    );
  }

  if (prices.length === 0) {
    return null;
  }

  // Duplicate prices for seamless looping
  const duplicatedPrices = [...prices, ...prices];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <View style={styles.tickerContainer}>
        <View style={styles.scrollView}>
          <Animated.View 
            style={[
              styles.pricesContainer,
              {
                transform: [{ translateX: Animated.multiply(animatedValue, -1) }]
              }
            ]}
          >
            {duplicatedPrices.map((price, index) => (
              <TouchableOpacity
                key={`${price.metal}-${index}`}
                style={styles.priceItem}
                onPress={() => onPricePress?.(price.metal)}
              >
                <Text style={styles.metalSymbol} numberOfLines={1}>{price.metal.toUpperCase()}</Text>
                <Text style={styles.priceValue}>{formatPrice(price.price)}</Text>
                <Text
                  style={[
                    styles.priceChange,
                    { color: getChangeColor(price.change) }
                  ]}
                >
                  {formatChange(price.change, price.changePercent)}
                </Text>
              </TouchableOpacity>
            ))}
          </Animated.View>
        </View>
        
        {/* Menu */}
        <View style={styles.rightSection}>
          <TouchableOpacity 
            style={styles.menuButton}
            onPress={() => setMenuVisible(true)}
          >
            <View style={styles.menuIcon}>
              <View style={styles.menuLine} />
              <View style={styles.menuLine} />
              <View style={styles.menuLine} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Hamburger Menu */}
      <HamburgerMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        onAccountPress={() => {
          // Navigate to account screen
          router.push('/(tabs)/account');
        }}
        onWishlistPress={() => {
          router.push('/wishlist');
        }}
        onPortfolioPress={() => {
          // TODO: Navigate to portfolio screen when implemented
        }}
        onCartPress={() => {
          // Navigate to cart screen
          router.push('/(tabs)/cart');
        }}
        onSignInPress={() => {
          // Navigate to auth screen
          router.push('/auth');
        }}
        onSignOutPress={async () => {
          // Sign out user
          await handleSignOut();
          setMenuVisible(false);
        }}
        isLoggedIn={Boolean(user && session)} // Check if user and session exist
        cartItemCount={cartItemCount}
        userName={userName}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000000',
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
    paddingTop: StatusBar.currentHeight || 0, // Account for status bar
  },
  tickerContainer: {
    height: 40,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  scrollView: {
    flex: 1,
    paddingRight: 60, // Space for hamburger menu icon
  },
  pricesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
  },
  priceItem: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#666666',
    backgroundColor: '#111111',
    marginRight: 2,
  },
  metalSymbol: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    marginRight: 8,
    textAlign: 'left',
  },
  priceValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginRight: 8,
    textAlign: 'center',
  },
  priceChange: {
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'right',
  },
  loadingContainer: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 10,
  },
  rightSection: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 12,
    paddingLeft: 8,
    backgroundColor: '#000000',
    zIndex: 10,
  },
  refreshButton: {
    padding: 6,
    borderRadius: 12,
    backgroundColor: '#333333',
    minWidth: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  refreshText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  avatarButton: {
    padding: 4,
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#333333',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  menuButton: {
    padding: 4,
  },
  menuIcon: {
    width: 20,
    height: 16,
    justifyContent: 'space-between',
  },
  menuLine: {
    width: 16,
    height: 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 1,
  },
});
