import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/theme/ThemeProvider';

export default function HomeScreen() {
  const { isLuxeTheme, tokens } = useTheme();
  
  // Debug logging
  console.log('HomeScreen - isLuxeTheme:', isLuxeTheme);
  console.log('HomeScreen - tokens:', tokens);
  const luxeStyles = isLuxeTheme ? {
    container: { backgroundColor: tokens.colors.bg },
    header: { backgroundColor: tokens.colors.bgElev },
    logo: { color: tokens.colors.text, fontFamily: tokens.typography.display },
    sectionTitle: { color: tokens.colors.text, fontFamily: tokens.typography.display },
    productCard: { 
      backgroundColor: tokens.colors.bgElev, 
      borderColor: tokens.colors.line,
      borderWidth: 1,
      ...tokens.shadows.luxe1
    },
    categoryCard: { 
      backgroundColor: tokens.colors.surface,
      borderColor: tokens.colors.line,
      borderWidth: 1,
    },
    ctaCard: { 
      backgroundColor: tokens.colors.surface,
      borderColor: tokens.colors.line,
      borderWidth: 1,
    },
    ctaButton: {
      backgroundColor: 'transparent',
      borderColor: tokens.colors.gold,
      borderWidth: 1,
    },
    ctaButtonText: { color: tokens.colors.text },
    productTitle: { color: tokens.colors.text },
    productPrice: { color: tokens.colors.text },
    productMetal: { color: tokens.colors.muted },
    categoryTitle: { color: tokens.colors.text },
    categorySubtitle: { color: tokens.colors.muted },
    ctaTitle: { color: tokens.colors.text, fontFamily: tokens.typography.display },
    ctaSubtitle: { color: tokens.colors.muted },
    viewAll: { color: tokens.colors.gold },
  } : {};

  return (
    <SafeAreaView style={[styles.container, luxeStyles.container]} edges={['bottom']}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={[styles.header, luxeStyles.header]}>
          <Text style={[styles.logo, luxeStyles.logo]}>FinestKnown</Text>
          <TouchableOpacity>
            <Ionicons name="search" size={24} color={isLuxeTheme ? tokens.colors.text : "#000"} />
          </TouchableOpacity>
        </View>

        {/* Live Prices Ticker is now at the top of the app */}

        {/* Featured Products */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, luxeStyles.sectionTitle]}>Featured Products</Text>
            <TouchableOpacity>
              <Text style={[styles.viewAll, luxeStyles.viewAll]}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={[styles.productCard, luxeStyles.productCard]}>
              <View style={styles.productImage}>
                <Text style={styles.productImageText}>Gold Eagle</Text>
              </View>
              <View style={styles.productInfo}>
                <Text style={[styles.productTitle, luxeStyles.productTitle]}>2024 American Gold Eagle 1oz</Text>
                <Text style={[styles.productPrice, luxeStyles.productPrice]}>$2,500.00</Text>
                <Text style={[styles.productMetal, luxeStyles.productMetal]}>Gold</Text>
              </View>
            </View>
            
            <View style={[styles.productCard, luxeStyles.productCard]}>
              <View style={styles.productImage}>
                <Text style={styles.productImageText}>Silver Maple</Text>
              </View>
              <View style={styles.productInfo}>
                <Text style={[styles.productTitle, luxeStyles.productTitle]}>2023 Canadian Silver Maple Leaf 1oz</Text>
                <Text style={[styles.productPrice, luxeStyles.productPrice]}>$35.00</Text>
                <Text style={[styles.productMetal, luxeStyles.productMetal]}>Silver</Text>
              </View>
            </View>
          </ScrollView>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, luxeStyles.sectionTitle]}>Shop by Category</Text>
          <View style={styles.categoriesGrid}>
            <TouchableOpacity style={[styles.categoryCard, luxeStyles.categoryCard]}>
              <Text style={[styles.categoryTitle, luxeStyles.categoryTitle]}>Gold</Text>
              <Text style={[styles.categorySubtitle, luxeStyles.categorySubtitle]}>Premium gold products</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.categoryCard, luxeStyles.categoryCard]}>
              <Text style={[styles.categoryTitle, luxeStyles.categoryTitle]}>Silver</Text>
              <Text style={[styles.categorySubtitle, luxeStyles.categorySubtitle]}>Silver coins & bars</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.categoryCard, luxeStyles.categoryCard]}>
              <Text style={[styles.categoryTitle, luxeStyles.categoryTitle]}>Platinum</Text>
              <Text style={[styles.categorySubtitle, luxeStyles.categorySubtitle]}>Rare platinum items</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.categoryCard, luxeStyles.categoryCard]}>
              <Text style={[styles.categoryTitle, luxeStyles.categoryTitle]}>Palladium</Text>
              <Text style={[styles.categorySubtitle, luxeStyles.categorySubtitle]}>Palladium collection</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Call to Action */}
        <View style={[styles.ctaCard, luxeStyles.ctaCard]}>
          <Text style={[styles.ctaTitle, luxeStyles.ctaTitle]}>Start Your Collection</Text>
          <Text style={[styles.ctaSubtitle, luxeStyles.ctaSubtitle]}>
            Discover authentic precious metals with real-time pricing
          </Text>
          <TouchableOpacity style={[styles.ctaButton, luxeStyles.ctaButton]}>
            <Text style={[styles.ctaButtonText, luxeStyles.ctaButtonText]}>Explore Catalog</Text>
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