import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useTheme } from '../../src/theme/ThemeProvider';
import { useAuth } from '../../src/store/AuthContext';
import { supabase } from '../../src/lib/supabase';
import { addToCart } from '../../src/api/cart';
import { addToWishlist, removeFromWishlist, isInWishlist as checkInWishlist } from '../../src/api/wishlist';
import { usePCGSVerification } from '../../src/hooks/usePCGSVerification';

interface Product {
  id: string;
  title: string;
  description: string;
  retail_price_cents: number;
  metal_type: string;
  weight_grams: number;
  year?: number;
  grade?: string | null;
  cert_number?: string | null;
  market_price_cents?: number | null;
  last_sale_cents?: number | null;
  primary_image_url: string;
  category_id: string;
}

// PCGS Market Data Component
function PCGSMarketDataComponent({ 
  coinData, 
  isLuxeTheme, 
  tokens 
}: { 
  coinData: any; 
  isLuxeTheme: boolean; 
  tokens: any;
}) {
  const safePriceValue = (value: number | string | undefined | null): number => {
    if (value === null || value === undefined) return 0;
    if (typeof value === 'number') return value;
    const parsed = parseFloat(String(value));
    return isNaN(parsed) ? 0 : parsed;
  };

  const safePopulationValue = (value: number | string | undefined | null): number => {
    if (value === null || value === undefined) return 0;
    if (typeof value === 'number') return value;
    const parsed = parseInt(String(value), 10);
    return isNaN(parsed) ? 0 : parsed;
  };

  // Pre-compute all values to avoid inline arithmetic
  const population = safePopulationValue(coinData.Population);
  const populationHigher = safePopulationValue(coinData.PopulationHigher);
  const populationStr = population > 0 ? population.toLocaleString() : 'N/A';
  const populationHigherStr = populationHigher > 0 ? populationHigher.toLocaleString() : 'N/A';
  
  const priceValue = safePriceValue(coinData.PriceGuideInfo?.Price);
  const bidValue = safePriceValue(coinData.PriceGuideInfo?.Bid);
  const askValue = safePriceValue(coinData.PriceGuideInfo?.Ask);
  
  const priceDisplay = priceValue > 0 ? `$${(priceValue / 100).toFixed(2)}` : '$0.00';
  const bidDisplay = bidValue > 0 ? `$${(bidValue / 100).toFixed(2)}` : '$0.00';
  const askDisplay = askValue > 0 ? `$${(askValue / 100).toFixed(2)}` : '$0.00';
  
  return (
    <View style={[styles.pcgsDataCard, isLuxeTheme ? { backgroundColor: tokens.colors.surface, borderColor: tokens.colors.line } : null]}>
      <View style={styles.sectionHeader}>
        <Ionicons name="analytics-outline" size={20} color={isLuxeTheme ? tokens.colors.gold : "#00D4AA"} />
        <Text style={[styles.sectionTitle, isLuxeTheme ? { color: tokens.colors.text } : null]}>
          Market Data
        </Text>
      </View>

      {/* Population Stats */}
      <View style={styles.statsRow}>
        <View style={[styles.statBox, isLuxeTheme ? { backgroundColor: tokens.colors.bgElev } : null]}>
          <Text style={[styles.statLabel, isLuxeTheme ? { color: tokens.colors.muted } : null]}>Population</Text>
          <Text style={[styles.statValue, isLuxeTheme ? { color: tokens.colors.text } : null]}>
            {populationStr}
          </Text>
        </View>
        <View style={[styles.statBox, isLuxeTheme ? { backgroundColor: tokens.colors.bgElev } : null]}>
          <Text style={[styles.statLabel, isLuxeTheme ? { color: tokens.colors.muted } : null]}>Higher</Text>
          <Text style={[styles.statValue, isLuxeTheme ? { color: tokens.colors.text } : null]}>
            {populationHigherStr}
          </Text>
        </View>
      </View>

      {/* Price Guide */}
      {coinData.PriceGuideInfo && (
        <View style={styles.priceRow}>
          <View style={[styles.priceBox, isLuxeTheme ? { backgroundColor: tokens.colors.bgElev } : null]}>
            <Text style={[styles.priceLabel, isLuxeTheme ? { color: tokens.colors.muted } : null]}>Price</Text>
            <Text style={[styles.priceValue, isLuxeTheme ? { color: tokens.colors.gold } : null]}>
              {priceDisplay}
            </Text>
          </View>
          <View style={[styles.priceBox, isLuxeTheme ? { backgroundColor: tokens.colors.bgElev } : null]}>
            <Text style={[styles.priceLabel, isLuxeTheme ? { color: tokens.colors.muted } : null]}>Bid</Text>
            <Text style={[styles.priceValue, isLuxeTheme ? { color: tokens.colors.text } : null]}>
              {bidDisplay}
            </Text>
          </View>
          <View style={[styles.priceBox, isLuxeTheme ? { backgroundColor: tokens.colors.bgElev } : null]}>
            <Text style={[styles.priceLabel, isLuxeTheme ? { color: tokens.colors.muted } : null]}>Ask</Text>
            <Text style={[styles.priceValue, isLuxeTheme ? { color: tokens.colors.text } : null]}>
              {askDisplay}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

export default function ItemDetailScreen() {
  const { id } = useLocalSearchParams();
  const { isLuxeTheme: isLuxeThemeRaw, tokens } = useTheme();
  // Ensure boolean type to prevent Java casting errors on React Native bridge
  const isLuxeTheme = Boolean(isLuxeThemeRaw);
  const { user } = useAuth();
  const [product, setProduct] = React.useState<Product | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [isInWishlistState, setIsInWishlistState] = React.useState(false);
  
  // PCGS Verification
  const { verification: pcgsVerification, coinData, loading: pcgsLoadingRaw } = usePCGSVerification(
    product?.cert_number || null,
    product?.grade || null
  );
  // Ensure boolean type to prevent Java casting errors
  const pcgsLoading = Boolean(pcgsLoadingRaw);

  console.log('ItemDetailScreen: Component loaded with ID:', id);

  React.useEffect(() => {
    if (id) {
      fetchProduct();
      checkWishlistStatus();
    }
  }, [id, user]);

  const checkWishlistStatus = async () => {
    if (!user || !id) return;
    try {
      const inWishlist = await checkInWishlist(id as string);
      setIsInWishlistState(inWishlist);
    } catch (error) {
      console.error('Error checking wishlist status:', error);
    }
  };

  const fetchProduct = async () => {
    console.log('ItemDetailScreen: Fetching product with ID:', id);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('ItemDetailScreen: Error fetching product:', error);
        return;
      }

      console.log('ItemDetailScreen: Product fetched successfully:', data?.title);
      setProduct(data);
    } catch (err) {
      console.error('ItemDetailScreen: Error fetching product:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (priceCents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(priceCents / 100);
  };

  // Helper function to safely convert price to number
  const safePriceValue = (value: number | string | undefined | null): number => {
    if (value === null || value === undefined) return 0;
    if (typeof value === 'number') return value;
    const parsed = parseFloat(String(value));
    return isNaN(parsed) ? 0 : parsed;
  };

  const handleAddToCart = async () => {
    if (!user) {
      Alert.alert('Login Required', 'Please log in to add items to your cart.');
      router.push('/auth?mode=signin');
      return;
    }

    if (!product?.id) {
      Alert.alert('Error', 'Product information is not available.');
      return;
    }
    
    try {
      await addToCart(product.id, 1);
      Alert.alert('Added to Cart', `${product?.title} has been added to your cart!`);
    } catch (error) {
      console.error('Add to cart error:', error);
      Alert.alert('Error', 'Failed to add item to cart. Please try again.');
    }
  };

  const handlePurchaseNow = () => {
    if (!user) {
      Alert.alert('Login Required', 'Please log in to purchase items.');
      router.push('/auth?mode=signin');
      return;
    }
    
    Alert.alert('Purchase Now', `Purchase functionality for ${product?.title} will be implemented soon!`);
  };

  const handleAddToWishlist = async () => {
    if (!user) {
      Alert.alert('Login Required', 'Please create an account to add items to your wishlist.');
      router.push('/auth?mode=signup');
      return;
    }

    if (!product?.id) return;

    try {
      if (isInWishlistState) {
        await removeFromWishlist(product.id);
        setIsInWishlistState(false);
        // Don't show alert for removing from wishlist
      } else {
        await addToWishlist(product.id);
        setIsInWishlistState(true);
        // Don't show alert for adding to wishlist
      }
    } catch (error) {
      console.error('Wishlist error:', error);
      Alert.alert('Error', 'Failed to update wishlist. Please try again.');
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, isLuxeTheme ? { backgroundColor: tokens.colors.bg } : null]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, isLuxeTheme ? { color: tokens.colors.text } : null]}>
            Loading product details...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView style={[styles.container, isLuxeTheme ? { backgroundColor: tokens.colors.bg } : null]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, isLuxeTheme ? { color: tokens.colors.text } : null]}>
            Product not found
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, isLuxeTheme ? { backgroundColor: tokens.colors.bg } : null]}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={[styles.header, isLuxeTheme ? { backgroundColor: tokens.colors.bgElev } : null]}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={isLuxeTheme ? tokens.colors.text : "#000"} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, isLuxeTheme ? { color: tokens.colors.text } : null]}>
            Item Details
          </Text>
          <TouchableOpacity onPress={handleAddToWishlist}>
            <Ionicons name={isInWishlistState ? "heart" : "heart-outline"} size={24} color={isLuxeTheme ? tokens.colors.gold : "#00D4AA"} />
          </TouchableOpacity>
        </View>

        {/* Product Image */}
        <View style={styles.imageContainer}>
          {product.primary_image_url ? (
            <Image source={{ uri: product.primary_image_url }} style={styles.productImage} />
          ) : (
            <View style={[styles.imagePlaceholder, isLuxeTheme ? { backgroundColor: tokens.colors.bgElev } : null]}>
              <Ionicons 
                name="diamond-outline" 
                size={80} 
                color={isLuxeTheme ? tokens.colors.muted : "#999"} 
              />
            </View>
          )}
        </View>

        {/* Product Info */}
        <View style={[styles.productInfo, isLuxeTheme ? { backgroundColor: tokens.colors.surface, borderColor: tokens.colors.line } : null]}>
          <Text style={[styles.productTitle, isLuxeTheme ? { color: tokens.colors.text } : null]}>
            {product.title}
          </Text>
          
          <Text style={[styles.productPrice, isLuxeTheme ? { color: tokens.colors.gold } : null]}>
            {formatPrice(product.retail_price_cents)}
          </Text>
          
          <View style={styles.productMeta}>
            <Text style={[styles.productMetal, isLuxeTheme ? { color: tokens.colors.muted } : null]}>
              {product.metal_type} • {product.weight_grams}g
            </Text>
            {product.year && (
              <Text style={[styles.productYear, isLuxeTheme ? { color: tokens.colors.muted } : null]}>
                {product.year}
              </Text>
            )}
          </View>
          
          <Text style={[styles.productDescription, isLuxeTheme ? { color: tokens.colors.text } : null]}>
            {product.description}
          </Text>
        </View>

        {/* PCGS Verification - Show for any product with cert_number */}
        {product.cert_number && (
          <View style={[styles.verificationCard, isLuxeTheme ? { backgroundColor: tokens.colors.surface, borderColor: tokens.colors.line } : null]}>
            <View style={styles.verificationHeader}>
              <Ionicons name="shield-checkmark" size={24} color={isLuxeTheme ? tokens.colors.gold : "#00D4AA"} />
              <Text style={[styles.verificationTitle, isLuxeTheme ? { color: tokens.colors.text } : null]}>
                PCGS Certified
              </Text>
            </View>
            
            {pcgsLoading ? (
              <Text style={[styles.verificationText, isLuxeTheme ? { color: tokens.colors.muted } : null]}>
                Verifying certification...
              </Text>
            ) : Boolean(pcgsVerification?.verified) ? (
              <View>
                <Text style={[styles.verificationText, isLuxeTheme ? { color: tokens.colors.text } : null]}>
                  Grade: {product.grade}
                </Text>
                <Text style={[styles.verificationText, isLuxeTheme ? { color: tokens.colors.muted } : null]}>
                  Cert #: {product.cert_number}
                </Text>
                <Text style={[styles.verificationBadge, isLuxeTheme ? { color: tokens.colors.success } : null]}>
                  ✓ Verified by PCGS
                </Text>
              </View>
            ) : (
              <View>
                <Text style={[styles.verificationText, isLuxeTheme ? { color: tokens.colors.text } : null]}>
                  Grade: {product.grade}
                </Text>
                <Text style={[styles.verificationText, isLuxeTheme ? { color: tokens.colors.muted } : null]}>
                  Cert #: {product.cert_number}
                </Text>
                <Text style={[styles.verificationBadge, isLuxeTheme ? { color: tokens.colors.muted } : null]}>
                  Certification data pending
                </Text>
              </View>
            )}
          </View>
        )}

        {/* PCGS Market Data */}
        {coinData && !pcgsLoading && (
          <PCGSMarketDataComponent coinData={coinData} isLuxeTheme={isLuxeTheme} tokens={tokens} />
        )}

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.addToCartButton, isLuxeTheme ? { backgroundColor: tokens.colors.gold } : null]}
            onPress={handleAddToCart}
          >
            <Ionicons name="cart-outline" size={20} color={isLuxeTheme ? tokens.colors.bg : "#000"} />
            <Text style={[styles.buttonText, isLuxeTheme ? { color: tokens.colors.bg } : null]}>
              Add to Cart
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.purchaseNowButton, isLuxeTheme ? { backgroundColor: tokens.colors.success } : null]}
            onPress={handlePurchaseNow}
          >
            <Ionicons name="card-outline" size={20} color={isLuxeTheme ? tokens.colors.bg : "#FFFFFF"} />
            <Text style={[styles.buttonText, isLuxeTheme ? { color: tokens.colors.bg } : null]}>
              Purchase Now
            </Text>
          </TouchableOpacity>
        </View>

        {/* Wishlist Button */}
        <View style={styles.wishlistContainer}>
          <TouchableOpacity 
            style={[styles.wishlistButton, isLuxeTheme ? { backgroundColor: tokens.colors.surface, borderColor: tokens.colors.gold } : null]}
            onPress={handleAddToWishlist}
          >
            <Ionicons name={isInWishlistState ? "heart" : "heart-outline"} size={20} color={isLuxeTheme ? tokens.colors.gold : "#00D4AA"} />
            <Text style={[styles.wishlistButtonText, isLuxeTheme ? { color: tokens.colors.gold } : null]}>
              {isInWishlistState ? "Remove from Wishlist" : "Add to Wishlist"}
            </Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666666',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  imageContainer: {
    height: 300,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productInfo: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  productTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#00D4AA',
    marginBottom: 12,
  },
  productMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  productMetal: {
    fontSize: 16,
    color: '#666666',
  },
  productYear: {
    fontSize: 16,
    color: '#666666',
  },
  productDescription: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333333',
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  addToCartButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00D4AA',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    gap: 8,
  },
  purchaseNowButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#32C36A',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    gap: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  wishlistContainer: {
    padding: 20,
    paddingTop: 0,
  },
  wishlistButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#00D4AA',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    gap: 8,
  },
  verificationCard: {
    margin: 20,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  verificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  verificationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  verificationText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  verificationBadge: {
    fontSize: 12,
    fontWeight: '600',
    color: '#32C36A',
    marginTop: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: '#F0FDF4',
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  wishlistButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00D4AA',
  },
  pcgsDataCard: {
    margin: 20,
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
  },
  priceRow: {
    flexDirection: 'row',
    gap: 12,
  },
  priceBox: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
  },
  priceLabel: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
  },
  priceValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00D4AA',
  },
});
