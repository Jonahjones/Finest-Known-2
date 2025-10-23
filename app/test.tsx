import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../src/components/ui/Button';
import { Card } from '../src/components/ui/Card';
import { ProductCard } from '../src/components/ui/ProductCard';
import { FinestKnownLogo } from '../src/components/FinestKnownLogo';
import { colors, typography, spacing } from '../src/design/tokens';

// Mock product for testing
const mockProduct = {
  id: '1',
  title: 'Test Gold Coin',
  description: 'A beautiful test gold coin',
  sku: 'TEST-001',
  category_id: '1',
  metal_type: 'Gold',
  weight_grams: 31.1,
  purity: 99.9,
  year: 2024,
  mint: 'Test Mint',
  grade: 'MS-70',
  cert_number: 'TEST123',
  retail_price_cents: 250000,
  market_price_cents: 240000,
  last_sale_cents: 245000,
  primary_image_url: 'https://via.placeholder.com/300x300',
  image_urls: ['https://via.placeholder.com/300x300'],
  size: '1 oz',
  condition: 'new',
  authenticity_guaranteed: true,
  is_active: true,
  is_featured: true,
  is_auction: false,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

export default function TestScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>FinestKnown App Test Screen</Text>
        
        {/* Logo Test */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Logo Component</Text>
          <FinestKnownLogo size="large" showText={true} />
        </Card>

        {/* Button Tests */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Button Components</Text>
          <View style={styles.buttonRow}>
            <Button title="Primary" onPress={() => {}} variant="primary" />
            <Button title="Secondary" onPress={() => {}} variant="secondary" />
          </View>
          <View style={styles.buttonRow}>
            <Button title="Outline" onPress={() => {}} variant="outline" />
            <Button title="Ghost" onPress={() => {}} variant="ghost" />
          </View>
          <View style={styles.buttonRow}>
            <Button title="Small" onPress={() => {}} size="sm" />
            <Button title="Medium" onPress={() => {}} size="md" />
            <Button title="Large" onPress={() => {}} size="lg" />
          </View>
        </Card>

        {/* Product Card Test */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Product Card Component</Text>
          <ProductCard
            product={mockProduct}
            onPress={() => {}}
            style={styles.productCard}
          />
        </Card>

        {/* Design Tokens Test */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Design Tokens</Text>
          <View style={styles.colorGrid}>
            <View style={[styles.colorSwatch, { backgroundColor: colors.primary }]}>
              <Text style={styles.colorLabel}>Primary</Text>
            </View>
            <View style={[styles.colorSwatch, { backgroundColor: colors.accent }]}>
              <Text style={styles.colorLabel}>Accent</Text>
            </View>
            <View style={[styles.colorSwatch, { backgroundColor: colors.success }]}>
              <Text style={styles.colorLabel}>Success</Text>
            </View>
            <View style={[styles.colorSwatch, { backgroundColor: colors.error }]}>
              <Text style={styles.colorLabel}>Error</Text>
            </View>
          </View>
        </Card>

        {/* Typography Test */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Typography</Text>
          <Text style={styles.displayText}>Display Text</Text>
          <Text style={styles.titleText}>Title Text</Text>
          <Text style={styles.headingText}>Heading Text</Text>
          <Text style={styles.bodyText}>Body Text</Text>
          <Text style={styles.captionText}>Caption Text</Text>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  
  scrollContent: {
    padding: spacing.lg,
  },
  
  title: {
    ...typography.display,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing['2xl'],
  },
  
  section: {
    marginBottom: spacing.lg,
  },
  
  sectionTitle: {
    ...typography.heading,
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },
  
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  
  productCard: {
    width: '100%',
  },
  
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  
  colorSwatch: {
    width: 80,
    height: 80,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  colorLabel: {
    ...typography.caption,
    color: colors.text.inverse,
    fontWeight: '600',
  },
  
  displayText: {
    ...typography.display,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  
  titleText: {
    ...typography.title,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  
  headingText: {
    ...typography.heading,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  
  bodyText: {
    ...typography.body,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  
  captionText: {
    ...typography.caption,
    color: colors.text.secondary,
  },
});
