import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { getLivePrices, refreshLivePrices } from '../api/livePrices';
import { LivePrice } from '../api/types';
import { HamburgerMenu } from './HamburgerMenu';
import { useCartItemCount } from '../hooks/useCart';
import { router } from 'expo-router';

const { width: screenWidth } = Dimensions.get('window');

interface LivePricesTickerProps {
  onPricePress?: (metal: string) => void;
}

export function LivePricesTicker({ onPricePress }: LivePricesTickerProps) {
  const [prices, setPrices] = useState<LivePrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [menuVisible, setMenuVisible] = useState(false);
  const cartItemCount = useCartItemCount();

  const loadPrices = async () => {
    try {
      console.log('Loading live prices for ticker...');
      const livePrices = await getLivePrices();
      console.log('Live prices loaded for ticker:', livePrices);
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
      console.log('Manually refreshing live prices...');
      const livePrices = await refreshLivePrices();
      console.log('Live prices refreshed:', livePrices);
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

  // Auto-scroll animation
  useEffect(() => {
    if (prices.length === 0) return;

    const scrollInterval = setInterval(() => {
      setScrollPosition(prev => {
        const itemWidth = 200; // Approximate width of each price item
        const totalWidth = prices.length * itemWidth * 2; // Double for seamless loop
        return (prev + 0.5) % totalWidth; // Slower, smoother movement
      });
    }, 16); // 60fps smooth scrolling

    return () => clearInterval(scrollInterval);
  }, [prices]);

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
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          scrollEnabled={false}
          style={styles.scrollView}
          contentOffset={{ x: scrollPosition, y: 0 }}
        >
          <View style={styles.pricesContainer}>
            {duplicatedPrices.map((price, index) => (
              <View
                key={`${price.metal}-${index}`}
                style={styles.priceItem}
                onTouchEnd={() => onPricePress?.(price.metal)}
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
              </View>
            ))}
          </View>
        </ScrollView>
        
        {/* Avatar and Menu */}
        <View style={styles.rightSection}>
          <TouchableOpacity 
            style={styles.refreshButton}
            onPress={handleRefresh}
            disabled={loading}
          >
            <Text style={styles.refreshText}>↻</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.avatarButton}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>U</Text>
            </View>
          </TouchableOpacity>
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
          router.push('/(tabs)');
        }}
        onCartPress={() => {
          // Navigate to cart screen
          router.push('/(tabs)/cart');
        }}
        onSignInPress={() => {
          // Navigate to auth screen
          router.push('/auth');
        }}
        isLoggedIn={false} // You can get this from auth context
        cartItemCount={cartItemCount}
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
  },
  scrollView: {
    flex: 1,
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 8,
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
