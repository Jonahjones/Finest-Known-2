import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Image } from 'expo-image';
import { colors, typography, spacing, borderRadius } from '../../design/tokens';
import { Product } from '../../api/types';

interface ProductCardProps {
  product: Product;
  onPress: (product: Product) => void;
  style?: ViewStyle;
}

export function ProductCard({ product, onPress, style }: ProductCardProps) {
  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(cents / 100);
  };

  const getMetalColor = (metalType: string) => {
    switch (metalType.toLowerCase()) {
      case 'gold':
        return colors.metal.gold;
      case 'silver':
        return colors.metal.silver;
      case 'platinum':
        return colors.metal.platinum;
      case 'palladium':
        return colors.metal.palladium;
      default:
        return colors.gray[500];
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={() => onPress(product)}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.primary_image_url || 'https://via.placeholder.com/200x200' }}
          style={styles.image}
          contentFit="cover"
          transition={200}
        />
        <View style={[styles.metalBadge, { backgroundColor: getMetalColor(product.metal_type) }]}>
          <Text style={styles.metalText}>{product.metal_type}</Text>
        </View>
        {product.is_featured && (
          <View style={styles.featuredBadge}>
            <Text style={styles.featuredText}>Featured</Text>
          </View>
        )}
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {product.title}
        </Text>
        
        <View style={styles.priceContainer}>
          <Text style={styles.price}>
            {formatPrice(product.retail_price_cents)}
          </Text>
          {product.market_price_cents && (
            <Text style={styles.marketPrice}>
              Market: {formatPrice(product.market_price_cents)}
            </Text>
          )}
        </View>
        
        <View style={styles.details}>
          {product.size && (
            <Text style={styles.detailText}>Size: {product.size}</Text>
          )}
          {product.year && (
            <Text style={styles.detailText}>Year: {product.year}</Text>
          )}
          {product.condition && (
            <Text style={styles.detailText}>Condition: {product.condition}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  imageContainer: {
    position: 'relative',
    height: 200,
  },
  
  image: {
    width: '100%',
    height: '100%',
  },
  
  metalBadge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.pill,
  },
  
  metalText: {
    ...typography.caption,
    color: colors.text.inverse,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  
  featuredBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.pill,
  },
  
  featuredText: {
    ...typography.caption,
    color: colors.text.inverse,
    fontWeight: '600',
  },
  
  content: {
    padding: spacing.md,
  },
  
  title: {
    ...typography.heading,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  
  priceContainer: {
    marginBottom: spacing.sm,
  },
  
  price: {
    ...typography.title,
    color: colors.primary,
    fontWeight: '700',
  },
  
  marketPrice: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  
  details: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  
  detailText: {
    ...typography.meta,
    color: colors.text.tertiary,
  },
});
