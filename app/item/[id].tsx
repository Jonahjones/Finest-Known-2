import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useTheme } from '../../src/theme/ThemeProvider';
import { useAuth } from '../../src/store/AuthContext';
import { supabase } from '../../src/lib/supabase';
import { addToCart } from '../../src/api/cart';

interface Product {
  id: string;
  title: string;
  description: string;
  retail_price_cents: number;
  metal_type: string;
  weight_grams: number;
  year?: number;
  primary_image_url: string;
  category_id: string;
}

export default function ItemDetailScreen() {
  const { id } = useLocalSearchParams();
  const { isLuxeTheme, tokens } = useTheme();
  const { user } = useAuth();
  const [product, setProduct] = React.useState<Product | null>(null);
  const [loading, setLoading] = React.useState(true);

  console.log('ItemDetailScreen: Component loaded with ID:', id);

  React.useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

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

  const handleAddToWishlist = () => {
    if (!user) {
      Alert.alert('Login Required', 'Please create an account to add items to your wishlist.');
      router.push('/auth?mode=signup');
      return;
    }
    
    Alert.alert('Added to Wishlist', `${product?.title} has been added to your wishlist!`);
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, isLuxeTheme && { backgroundColor: tokens.colors.bg }]} edges={['bottom']}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, isLuxeTheme && { color: tokens.colors.text }]}>
            Loading product details...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView style={[styles.container, isLuxeTheme && { backgroundColor: tokens.colors.bg }]} edges={['bottom']}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, isLuxeTheme && { color: tokens.colors.text }]}>
            Product not found
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, isLuxeTheme && { backgroundColor: tokens.colors.bg }]} edges={['bottom']}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={[styles.header, isLuxeTheme && { backgroundColor: tokens.colors.bgElev }]}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={isLuxeTheme ? tokens.colors.text : "#000"} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, isLuxeTheme && { color: tokens.colors.text }]}>
            Item Details
          </Text>
          <TouchableOpacity onPress={handleAddToWishlist}>
            <Ionicons name="heart-outline" size={24} color={isLuxeTheme ? tokens.colors.gold : "#00D4AA"} />
          </TouchableOpacity>
        </View>

        {/* Product Image */}
        <View style={styles.imageContainer}>
          {product.primary_image_url ? (
            <Image source={{ uri: product.primary_image_url }} style={styles.productImage} />
          ) : (
            <View style={[styles.imagePlaceholder, isLuxeTheme && { backgroundColor: tokens.colors.bgElev }]}>
              <Ionicons 
                name="diamond-outline" 
                size={80} 
                color={isLuxeTheme ? tokens.colors.muted : "#999"} 
              />
            </View>
          )}
        </View>

        {/* Product Info */}
        <View style={[styles.productInfo, isLuxeTheme && { backgroundColor: tokens.colors.surface, borderColor: tokens.colors.line }]}>
          <Text style={[styles.productTitle, isLuxeTheme && { color: tokens.colors.text }]}>
            {product.title}
          </Text>
          
          <Text style={[styles.productPrice, isLuxeTheme && { color: tokens.colors.gold }]}>
            {formatPrice(product.retail_price_cents)}
          </Text>
          
          <View style={styles.productMeta}>
            <Text style={[styles.productMetal, isLuxeTheme && { color: tokens.colors.muted }]}>
              {product.metal_type} • {product.weight_grams}g
            </Text>
            {product.year && (
              <Text style={[styles.productYear, isLuxeTheme && { color: tokens.colors.muted }]}>
                {product.year}
              </Text>
            )}
          </View>
          
          <Text style={[styles.productDescription, isLuxeTheme && { color: tokens.colors.text }]}>
            {product.description}
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.addToCartButton, isLuxeTheme && { backgroundColor: tokens.colors.gold }]}
            onPress={handleAddToCart}
          >
            <Ionicons name="cart-outline" size={20} color={isLuxeTheme ? tokens.colors.bg : "#000"} />
            <Text style={[styles.buttonText, isLuxeTheme && { color: tokens.colors.bg }]}>
              Add to Cart
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.purchaseNowButton, isLuxeTheme && { backgroundColor: tokens.colors.success }]}
            onPress={handlePurchaseNow}
          >
            <Ionicons name="card-outline" size={20} color={isLuxeTheme ? tokens.colors.bg : "#FFFFFF"} />
            <Text style={[styles.buttonText, isLuxeTheme && { color: tokens.colors.bg }]}>
              Purchase Now
            </Text>
          </TouchableOpacity>
        </View>

        {/* Wishlist Button */}
        <View style={styles.wishlistContainer}>
          <TouchableOpacity 
            style={[styles.wishlistButton, isLuxeTheme && { backgroundColor: tokens.colors.surface, borderColor: tokens.colors.gold }]}
            onPress={handleAddToWishlist}
          >
            <Ionicons name="heart-outline" size={20} color={isLuxeTheme ? tokens.colors.gold : "#00D4AA"} />
            <Text style={[styles.wishlistButtonText, isLuxeTheme && { color: tokens.colors.gold }]}>
              Add to Wishlist
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
  wishlistButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00D4AA',
  },
});
