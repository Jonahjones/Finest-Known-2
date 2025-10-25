import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { PersonaType, PERSONA_CONFIGS } from '../store/onboardingStore';
import { useTheme } from '../theme/ThemeProvider';
import { useAuth } from '../store/AuthContext';
import { supabase } from '../lib/supabase';
import { router } from 'expo-router';

interface Product {
  id: string;
  title: string;
  description: string;
  retail_price_cents: number;
  primary_image_url: string;
  metal_type: string;
  weight_grams: number;
  year: number;
  mint: string;
  condition: string;
  persona_tags: string[];
}

interface PersonalizedGalleryProps {
  persona: PersonaType;
  onItemPress: (item: Product) => void;
  onContinue: () => void;
}

export function PersonalizedGallery({ persona, onItemPress, onContinue }: PersonalizedGalleryProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { isLuxeTheme, tokens } = useTheme();
  const { user, session, loading: authLoading } = useAuth();
  
  const personaConfig = PERSONA_CONFIGS[persona];
  
  // Debug authentication state
  console.log('PersonalizedGallery: Auth state:', {
    user: !!user,
    userId: user?.id,
    session: !!session,
    authLoading,
    persona
  });

  useEffect(() => {
    fetchPersonalizedProducts();
  }, [persona]);

  const fetchPersonalizedProducts = async () => {
    try {
      setLoading(true);
      
      console.log('Fetching products for persona:', persona);
      
      let query = supabase
        .from('products')
        .select(`
          id,
          title,
          description,
          retail_price_cents,
          primary_image_url,
          metal_type,
          weight_grams,
          year,
          mint,
          condition,
          persona_tags
        `)
        .eq('is_active', true)
        .not('primary_image_url', 'is', null)
        .neq('primary_image_url', '')
        .contains('persona_tags', [persona])
        .limit(12);

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching personalized products:', error);
        setProducts([]);
      } else {
        console.log('Fetched products:', data?.length || 0);
        setProducts(data || []);
      }
    } catch (error) {
      console.error('Error fetching personalized products:', error);
      setProducts([]);
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

  const renderProductCard = (product: Product) => {
    console.log('PersonalizedGallery: Rendering product card for:', product.title);
    return (
      <TouchableOpacity
        key={product.id}
        style={[
          styles.productCard,
          isLuxeTheme && {
            backgroundColor: tokens.colors.surface,
            borderColor: tokens.colors.line,
            borderWidth: 1,
          }
        ]}
        onPress={() => {
          console.log('PersonalizedGallery: Product card pressed:', product.title, 'ID:', product.id);
          console.log('PersonalizedGallery: onItemPress function:', typeof onItemPress);
          try {
            onItemPress(product);
          } catch (error) {
            console.error('PersonalizedGallery: Error calling onItemPress:', error);
          }
        }}
        activeOpacity={0.7}
        pointerEvents="auto"
      >
      <View style={styles.productImageContainer}>
        {product.primary_image_url ? (
          <Image source={{ uri: product.primary_image_url }} style={styles.productImage} />
        ) : (
          <View style={[styles.productImagePlaceholder, isLuxeTheme && { backgroundColor: tokens.colors.bgElev }]}>
            <Ionicons 
              name="diamond-outline" 
              size={32} 
              color={isLuxeTheme ? tokens.colors.gold : '#6B7280'} 
            />
          </View>
        )}
      </View>
      
      <View style={styles.productInfo}>
        <Text 
          style={[
            styles.productTitle,
            isLuxeTheme && { color: tokens.colors.text }
          ]}
          numberOfLines={2}
        >
          {product.title}
        </Text>
        
        <Text 
          style={[
            styles.productPrice,
            isLuxeTheme && { color: tokens.colors.gold }
          ]}
        >
          {formatPrice(product.retail_price_cents)}
        </Text>
        
        <View style={styles.productMeta}>
          <Text 
            style={[
              styles.productMetal,
              isLuxeTheme && { color: tokens.colors.muted }
            ]}
          >
            {product.metal_type} • {product.weight_grams}g
          </Text>
          {product.year && (
            <Text 
              style={[
                styles.productYear,
                isLuxeTheme && { color: tokens.colors.muted }
              ]}
            >
              {product.year}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  // Check if user is authenticated
  if (!user || !session) {
    return (
      <SafeAreaView style={[styles.container, isLuxeTheme && { backgroundColor: tokens.colors.bg }]}>
        <View style={styles.loadingContainer}>
          <Ionicons 
            name="warning-outline" 
            size={60} 
            color={isLuxeTheme ? tokens.colors.gold : '#FF6B6B'} 
          />
          <Text 
            style={[
              styles.loadingText,
              isLuxeTheme && { color: tokens.colors.text }
            ]}
          >
            Authentication Error
          </Text>
          <Text 
            style={[
              styles.loadingText,
              isLuxeTheme && { color: tokens.colors.muted }
            ]}
          >
            You need to be logged in to see personalized recommendations.
          </Text>
          <TouchableOpacity 
            style={[styles.continueButton, isLuxeTheme && { backgroundColor: tokens.colors.gold }]}
            onPress={onContinue}
          >
            <Text style={[styles.continueButtonText, isLuxeTheme && { color: tokens.colors.bg }]}>
              Continue to Marketplace
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, isLuxeTheme && { backgroundColor: tokens.colors.bg }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator 
            size="large" 
            color={isLuxeTheme ? tokens.colors.gold : '#00D4AA'} 
          />
          <Text 
            style={[
              styles.loadingText,
              isLuxeTheme && { color: tokens.colors.text }
            ]}
          >
            Finding perfect items for you...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, isLuxeTheme && { backgroundColor: tokens.colors.bg }]} edges={['bottom']}>
      <ScrollView style={styles.scrollView} pointerEvents="auto">
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text 
              style={[
                styles.welcomeTitle,
                isLuxeTheme && { color: tokens.colors.text }
              ]}
            >
              Welcome to your personalized vault
            </Text>
            <Text 
              style={[
                styles.personaDescription,
                isLuxeTheme && { color: tokens.colors.muted }
              ]}
            >
              {personaConfig.description}
            </Text>
          </View>
        </View>

        {/* Recommended Items */}
        <View style={styles.section}>
          <Text 
            style={[
              styles.sectionTitle,
              isLuxeTheme && { color: tokens.colors.text }
            ]}
          >
            Recommended for you
          </Text>
          
          {products.length > 0 ? (
            <View style={styles.productsGrid}>
              {console.log('PersonalizedGallery: Rendering', products.length, 'products')}
              {products.map(renderProductCard)}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Ionicons 
                name="search-outline" 
                size={48} 
                color={isLuxeTheme ? tokens.colors.muted : '#6B7280'} 
              />
              <Text 
                style={[
                  styles.emptyText,
                  isLuxeTheme && { color: tokens.colors.muted }
                ]}
              >
                No items found for your preferences yet.
              </Text>
              <Text 
                style={[
                  styles.emptySubtext,
                  isLuxeTheme && { color: tokens.colors.muted }
                ]}
              >
                Check back soon for new additions!
              </Text>
            </View>
          )}
        </View>

        {/* Continue Button */}
        <View style={styles.continueSection}>
          <TouchableOpacity
            style={[
              styles.continueButton,
              isLuxeTheme && {
                backgroundColor: 'transparent',
                borderColor: tokens.colors.gold,
                borderWidth: 1,
              }
            ]}
            onPress={onContinue}
          >
            <Text 
              style={[
                styles.continueButtonText,
                isLuxeTheme && { color: tokens.colors.text }
              ]}
            >
              Continue to Marketplace
            </Text>
            <Ionicons 
              name="arrow-forward" 
              size={20} 
              color={isLuxeTheme ? tokens.colors.text : '#FFFFFF'} 
            />
          </TouchableOpacity>
          
          {/* Test Navigation Button */}
          <TouchableOpacity
            style={[
              styles.continueButton,
              isLuxeTheme && {
                backgroundColor: tokens.colors.gold,
                borderColor: tokens.colors.gold,
                borderWidth: 1,
                marginTop: 8,
              }
            ]}
            onPress={() => {
              console.log('Test navigation button pressed');
              router.push('/item/test-product-id');
            }}
          >
            <Text 
              style={[
                styles.continueButtonText,
                isLuxeTheme && { color: tokens.colors.bg }
              ]}
            >
              Test Navigation
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
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  header: {
    padding: 24,
    alignItems: 'center',
  },
  headerContent: {
    alignItems: 'center',
    maxWidth: 300,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 8,
  },
  personaDescription: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
  },
  section: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 20,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  productCard: {
    width: '47%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 16,
  },
  productImageContainer: {
    height: 120,
    backgroundColor: '#F3F4F6',
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  productImagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  productInfo: {
    padding: 12,
  },
  productTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 6,
    lineHeight: 18,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#00D4AA',
    marginBottom: 4,
  },
  productMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productMetal: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  productYear: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  continueSection: {
    padding: 24,
    paddingBottom: 40,
  },
  continueButton: {
    backgroundColor: '#00D4AA',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
