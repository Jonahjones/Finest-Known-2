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
import { useAuth } from '../../src/store/AuthContext';

export default function HomeScreen() {
  const { isLuxeTheme, tokens } = useTheme();
  const { user, session, loading } = useAuth();

  return (
    <SafeAreaView style={[styles.container, isLuxeTheme && { backgroundColor: tokens.colors.bg }]} edges={['bottom']}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={[styles.header, isLuxeTheme && { backgroundColor: tokens.colors.bgElev }]}>
          <Text style={[styles.logo, isLuxeTheme && { color: tokens.colors.text }]}>FinestKnown</Text>
          <TouchableOpacity>
            <Ionicons name="search" size={24} color={isLuxeTheme ? tokens.colors.text : "#000"} />
          </TouchableOpacity>
        </View>

        {/* Debug Auth Status */}
        <View style={[styles.debugSection, isLuxeTheme && { backgroundColor: tokens.colors.bgElev }]}>
          <Text style={[styles.debugTitle, isLuxeTheme && { color: tokens.colors.text }]}>
            Auth Status (Debug)
          </Text>
          <Text style={[styles.debugText, isLuxeTheme && { color: tokens.colors.muted }]}>
            Loading: {loading ? 'Yes' : 'No'}
          </Text>
          <Text style={[styles.debugText, isLuxeTheme && { color: tokens.colors.muted }]}>
            User: {user ? 'Logged In' : 'Not Logged In'}
          </Text>
          <Text style={[styles.debugText, isLuxeTheme && { color: tokens.colors.muted }]}>
            Session: {session ? 'Active' : 'No Session'}
          </Text>
          <Text style={[styles.debugText, isLuxeTheme && { color: tokens.colors.muted }]}>
            User ID: {user?.id || 'N/A'}
          </Text>
        </View>

        {/* Live Prices Ticker is now at the top of the app */}

        {/* Featured Products */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, isLuxeTheme && { color: tokens.colors.text }]}>Featured Products</Text>
            <TouchableOpacity>
              <Text style={[styles.viewAll, isLuxeTheme && { color: tokens.colors.gold }]}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={[styles.productCard, isLuxeTheme && { backgroundColor: tokens.colors.bgElev, borderColor: tokens.colors.line, borderWidth: 1 }]}>
              <View style={styles.productImage}>
                <Text style={styles.productImageText}>Gold Eagle</Text>
              </View>
              <View style={styles.productInfo}>
                <Text style={[styles.productTitle, isLuxeTheme && { color: tokens.colors.text }]}>2024 American Gold Eagle 1oz</Text>
                <Text style={[styles.productPrice, isLuxeTheme && { color: tokens.colors.text }]}>$2,500.00</Text>
                <Text style={[styles.productMetal, isLuxeTheme && { color: tokens.colors.muted }]}>Gold</Text>
              </View>
            </View>
            
            <View style={[styles.productCard, isLuxeTheme && { backgroundColor: tokens.colors.bgElev, borderColor: tokens.colors.line, borderWidth: 1 }]}>
              <View style={styles.productImage}>
                <Text style={styles.productImageText}>Silver Maple</Text>
              </View>
              <View style={styles.productInfo}>
                <Text style={[styles.productTitle, isLuxeTheme && { color: tokens.colors.text }]}>2023 Canadian Silver Maple Leaf 1oz</Text>
                <Text style={[styles.productPrice, isLuxeTheme && { color: tokens.colors.text }]}>$35.00</Text>
                <Text style={[styles.productMetal, isLuxeTheme && { color: tokens.colors.muted }]}>Silver</Text>
              </View>
            </View>
          </ScrollView>
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