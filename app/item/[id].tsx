import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useTheme } from '../../src/theme/ThemeProvider';
import { useAuth } from '../../src/store/AuthContext';
import { supabase } from '../../src/lib/supabase';

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

  React.useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching product:', error);
        return;
      }

      setProduct(data);
    } catch (err) {
      console.error('Error fetching product:', err);
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

  const handleAddToCart = () => {
    if (!user) {
      Alert.alert('Login Required', 'Please log in to add items to your cart.');
      return;
    }
    
    Alert.alert('Added to Cart', `${product?.title} has been added to your cart!`);
  };

  const handleMakeOffer = () => {
    if (!user) {
      Alert.alert('Login Required', 'Please log in to make offers.');
      return;
    }
    
    Alert.alert('Make Offer', `Offer functionality for ${product?.title} will be implemented soon!`);
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
          <TouchableOpacity>
            <Ionicons name="heart-outline" size={24} color={isLuxeTheme ? tokens.colors.text : "#000"} />
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
            style={[styles.makeOfferButton, isLuxeTheme && { backgroundColor: tokens.colors.surface, borderColor: tokens.colors.gold }]}
            onPress={handleMakeOffer}
          >
            <Ionicons name="hand-left-outline" size={20} color={isLuxeTheme ? tokens.colors.gold : "#00D4AA"} />
            <Text style={[styles.buttonText, isLuxeTheme && { color: tokens.colors.gold }]}>
              Make Offer
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
  makeOfferButton: {
    flex: 1,
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
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
});
