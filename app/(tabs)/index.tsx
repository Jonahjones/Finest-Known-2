import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '../../src/theme/ThemeProvider';
import { useAuth } from '../../src/store/AuthContext';
import { supabase } from '../../src/lib/supabase';

export default function HomeScreen() {
  const { isLuxeTheme, tokens } = useTheme();
  const { user } = useAuth();
  const [featuredProducts, setFeaturedProducts] = React.useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = React.useState(true);

  React.useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      setLoadingProducts(true);
      const { data, error } = await supabase
        .from('products')
        .select('id, title, retail_price_cents, primary_image_url, metal_type, weight_grams')
        .eq('is_active', true)
        .not('primary_image_url', 'is', null)
        .neq('primary_image_url', '')
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) {
        console.error('Error fetching featured products:', error);
        setFeaturedProducts([]);
      } else {
        console.log('Fetched featured products:', data?.length || 0);
        setFeaturedProducts(data || []);
      }
    } catch (error) {
      console.error('Error fetching featured products:', error);
      setFeaturedProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  };

  const formatPrice = (priceCents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(priceCents / 100);
  };

  const handleProductPress = (product: any) => {
    console.log('Home: Product pressed:', product.title, 'ID:', product.id);
    router.push(`/item/${product.id}`);
  };

  return (
    <SafeAreaView style={[styles.container, isLuxeTheme && { backgroundColor: tokens.colors.bg }]} edges={['bottom']}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={[styles.header, isLuxeTheme && { backgroundColor: tokens.colors.bgElev }]}>
          <Text style={[styles.logo, isLuxeTheme && { color: tokens.colors.text }]}>FinestKnown</Text>
          <View style={styles.headerRight}>
            <TouchableOpacity>
              <Ionicons name="search" size={24} color={isLuxeTheme ? tokens.colors.text : "#000"} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Live Prices Ticker is now at the top of the app */}

        {/* Featured Products */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, isLuxeTheme && { color: tokens.colors.text }]}>Featured Products</Text>
            <TouchableOpacity onPress={() => router.push('/catalog')}>
              <Text style={[styles.viewAll, isLuxeTheme && { color: tokens.colors.gold }]}>View All</Text>
            </TouchableOpacity>
          </View>
          
          {loadingProducts ? (
            <View style={styles.loadingContainer}>
              <Text style={[styles.loadingText, isLuxeTheme && { color: tokens.colors.muted }]}>Loading products...</Text>
            </View>
          ) : featuredProducts.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {featuredProducts.map((product) => (
                <TouchableOpacity
                  key={product.id}
                  style={[styles.productCard, isLuxeTheme && { backgroundColor: tokens.colors.bgElev, borderColor: tokens.colors.line, borderWidth: 1 }]}
                  onPress={() => handleProductPress(product)}
                >
                  <View style={styles.productImage}>
                    {product.primary_image_url ? (
                      <Image source={{ uri: product.primary_image_url }} style={styles.productImageContent} />
                    ) : (
                      <View style={styles.productImagePlaceholder}>
                        <Ionicons name="diamond-outline" size={32} color={isLuxeTheme ? tokens.colors.muted : '#6B7280'} />
                      </View>
                    )}
                  </View>
                  <View style={styles.productInfo}>
                    <Text style={[styles.productTitle, isLuxeTheme && { color: tokens.colors.text }]} numberOfLines={2}>
                      {product.title}
                    </Text>
                    <Text style={[styles.productPrice, isLuxeTheme && { color: tokens.colors.gold }]}>
                      {formatPrice(product.retail_price_cents)}
                    </Text>
                    <Text style={[styles.productMetal, isLuxeTheme && { color: tokens.colors.muted }]}>
                      {product.metal_type} • {product.weight_grams}g
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={48} color={isLuxeTheme ? tokens.colors.muted : '#6B7280'} />
              <Text style={[styles.emptyText, isLuxeTheme && { color: tokens.colors.muted }]}>No featured products available</Text>
            </View>
          )}
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isLuxeTheme && { color: tokens.colors.text }]}>Shop by Category</Text>
          <View style={styles.categoriesGrid}>
            <TouchableOpacity style={[styles.categoryCard, isLuxeTheme && { backgroundColor: tokens.colors.surface, borderColor: tokens.colors.line, borderWidth: 1 }]}>
              <Text style={[styles.categoryTitle, isLuxeTheme && { color: tokens.colors.text }]}>Gold</Text>
              <Text style={[styles.categorySubtitle, isLuxeTheme && { color: tokens.colors.muted }]}>Premium gold products</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.categoryCard, isLuxeTheme && { backgroundColor: tokens.colors.surface, borderColor: tokens.colors.line, borderWidth: 1 }]}>
              <Text style={[styles.categoryTitle, isLuxeTheme && { color: tokens.colors.text }]}>Silver</Text>
              <Text style={[styles.categorySubtitle, isLuxeTheme && { color: tokens.colors.muted }]}>Silver coins & bars</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.categoryCard, isLuxeTheme && { backgroundColor: tokens.colors.surface, borderColor: tokens.colors.line, borderWidth: 1 }]}>
              <Text style={[styles.categoryTitle, isLuxeTheme && { color: tokens.colors.text }]}>Platinum</Text>
              <Text style={[styles.categorySubtitle, isLuxeTheme && { color: tokens.colors.muted }]}>Rare platinum items</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.categoryCard, isLuxeTheme && { backgroundColor: tokens.colors.surface, borderColor: tokens.colors.line, borderWidth: 1 }]}>
              <Text style={[styles.categoryTitle, isLuxeTheme && { color: tokens.colors.text }]}>Palladium</Text>
              <Text style={[styles.categorySubtitle, isLuxeTheme && { color: tokens.colors.muted }]}>Palladium collection</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Call to Action */}
        <View style={[styles.ctaCard, isLuxeTheme && { backgroundColor: tokens.colors.surface, borderColor: tokens.colors.line, borderWidth: 1 }]}>
          <Text style={[styles.ctaTitle, isLuxeTheme && { color: tokens.colors.text }]}>Start Your Collection</Text>
          <Text style={[styles.ctaSubtitle, isLuxeTheme && { color: tokens.colors.muted }]}>
            Discover authentic precious metals with real-time pricing
          </Text>
          <TouchableOpacity style={[styles.ctaButton, isLuxeTheme && { backgroundColor: 'transparent', borderColor: tokens.colors.gold, borderWidth: 1 }]}>
            <Text style={[styles.ctaButtonText, isLuxeTheme && { color: tokens.colors.text }]}>Explore Catalog</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  userStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  userStatusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#32C36A',
  },
  logoutButton: {
    backgroundColor: '#FF5A5A',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginLeft: 8,
  },
  logoutButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  loginButton: {
    fontSize: 16,
    fontWeight: '600',
    color: '#00D4AA',
  },
  welcomeSection: {
    margin: 20,
    padding: 20,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 22,
  },
  debugSection: {
    margin: 20,
    padding: 16,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  debugTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  debugText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  checkSessionButton: {
    backgroundColor: '#00D4AA',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginTop: 10,
    alignSelf: 'center',
  },
  checkSessionButtonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'bold',
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 16,
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAll: {
    fontSize: 14,
    color: '#00D4AA',
    fontWeight: '600',
  },
  productCard: {
    width: 200,
    marginRight: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    height: 150,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  productImageText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '600',
  },
  productImageContent: {
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
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 16,
    textAlign: 'center',
  },
  productInfo: {
    padding: 16,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  productMetal: {
    fontSize: 12,
    color: '#6B7280',
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  categorySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  ctaCard: {
    margin: 20,
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
  },
  ctaTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
    textAlign: 'center',
  },
  ctaSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  ctaButton: {
    backgroundColor: '#000000',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
  },
  ctaButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});