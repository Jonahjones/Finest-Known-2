import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useWishlist } from '../src/hooks/useWishlist';
import { useCart } from '../src/hooks/useCart';
import { Button } from '../src/components/ui/Button';
import { Card } from '../src/components/ui/Card';
import { useTheme } from '../src/theme/ThemeProvider';
import { colors, spacing, typography } from '../src/design/tokens';
import { router, useFocusEffect } from 'expo-router';

export default function WishlistScreen() {
  const { isLuxeTheme, tokens } = useTheme();
  const { wishlistItems, loading, error, removeFromWishlist, refreshWishlist } = useWishlist();
  const { addToCart } = useCart();

  // Refresh wishlist when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      refreshWishlist();
    }, [])
  );

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(cents / 100);
  };

  const handleAddToCart = async (productId: string, productTitle: string) => {
    await addToCart(productId, 1);
    Alert.alert('Added to Cart', `"${productTitle}" has been added to your cart`);
  };

  const handleRemoveFromWishlist = (productId: string, productTitle: string) => {
    Alert.alert(
      'Remove from Wishlist',
      `Remove "${productTitle}" from your wishlist?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: () => removeFromWishlist(productId)
        },
      ]
    );
  };

  const handleCheckout = () => {
    // Navigate to checkout screen
    router.push('/checkout');
  };

  const renderWishlistItem = ({ item }: { item: any }) => {
    const imageUrl = item.product?.primary_image_url || item.product?.image_url;
    
    return (
      <Card style={styles.wishlistItem}>
        <View style={styles.itemImage}>
          {imageUrl ? (
            <Image 
              source={{ uri: imageUrl }}
              style={styles.productImage}
              defaultSource={require('../assets/icon.png')}
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons name="image" size={32} color={colors.text.tertiary} />
            </View>
          )}
        </View>
        
        <View style={styles.itemDetails}>
          <Text style={styles.itemTitle} numberOfLines={2}>
            {item.product?.title || 'Product'}
          </Text>
          <Text style={styles.itemPrice}>
            {formatPrice(item.product?.retail_price_cents || 0)}
          </Text>
          <Text style={styles.itemMetal}>
            {item.product?.metal_type || 'Unknown'}
          </Text>
        </View>
        
        <View style={styles.itemActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleAddToCart(item.product_id, item.product?.title)}
          >
            <Ionicons name="cart-outline" size={20} color={colors.primary} />
            <Text style={styles.actionButtonText}>Add to Cart</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => handleRemoveFromWishlist(item.product_id, item.product?.title)}
          >
            <Ionicons name="trash-outline" size={20} color={colors.error} />
          </TouchableOpacity>
        </View>
      </Card>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading wishlist...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color={colors.error} />
          <Text style={styles.errorTitle}>Error loading wishlist</Text>
          <Text style={styles.errorMessage}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Ionicons name="heart-outline" size={64} color={colors.text.tertiary} />
          <Text style={styles.emptyTitle}>Your wishlist is empty</Text>
          <Text style={styles.emptySubtitle}>
            Add products you love to your wishlist
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <Text style={styles.title}>My Wishlist</Text>
      </View>

      <FlatList
        data={wishlistItems}
        renderItem={renderWishlistItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.wishlistList}
        showsVerticalScrollIndicator={false}
      />

      {wishlistItems.length > 0 && (
        <View style={styles.footer}>
          <Button
            title="Add All to Cart"
            onPress={async () => {
              for (const item of wishlistItems) {
                await addToCart(item.product_id, 1);
              }
              Alert.alert('Added to Cart', 'All wishlist items have been added to your cart');
            }}
            style={styles.addAllButton}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    paddingBottom: spacing.md,
  },
  
  title: {
    fontSize: typography.title.fontSize,
    lineHeight: typography.title.lineHeight,
    fontWeight: typography.title.fontWeight,
    color: colors.text.primary,
  },
  
  wishlistList: {
    padding: spacing.lg,
    paddingTop: 0,
  },
  
  wishlistItem: {
    flexDirection: 'row',
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  
  itemImage: {
    width: 80,
    height: 80,
    marginRight: spacing.md,
  },
  
  productImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    backgroundColor: colors.surface,
  },
  
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.surface,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  itemDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  
  itemTitle: {
    fontSize: typography.body.fontSize,
    lineHeight: typography.body.lineHeight,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  
  itemPrice: {
    fontSize: typography.heading.fontSize,
    lineHeight: typography.heading.lineHeight,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  
  itemMetal: {
    fontSize: typography.caption.fontSize,
    lineHeight: typography.caption.lineHeight,
    fontWeight: '600',
    color: colors.text.secondary,
    textTransform: 'uppercase',
  },
  
  itemActions: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.sm,
    borderRadius: 8,
    marginBottom: spacing.sm,
  },
  
  actionButtonText: {
    fontSize: typography.caption.fontSize,
    color: colors.primary,
    fontWeight: '600',
    marginLeft: spacing.xs,
  },
  
  removeButton: {
    padding: spacing.sm,
  },
  
  footer: {
    padding: spacing.lg,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  
  addAllButton: {
    width: '100%',
  },
  
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  loadingText: {
    fontSize: typography.body.fontSize,
    lineHeight: typography.body.lineHeight,
    fontWeight: typography.body.fontWeight,
    color: colors.text.secondary,
  },
  
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  
  errorTitle: {
    fontSize: typography.heading.fontSize,
    lineHeight: typography.heading.lineHeight,
    fontWeight: typography.heading.fontWeight,
    color: colors.text.primary,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  
  errorMessage: {
    fontSize: typography.body.fontSize,
    lineHeight: typography.body.lineHeight,
    fontWeight: typography.body.fontWeight,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  
  emptyTitle: {
    fontSize: typography.title.fontSize,
    lineHeight: typography.title.lineHeight,
    fontWeight: typography.title.fontWeight,
    color: colors.text.primary,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  
  emptySubtitle: {
    fontSize: typography.body.fontSize,
    lineHeight: typography.body.lineHeight,
    fontWeight: typography.body.fontWeight,
    color: colors.text.secondary,
    textAlign: 'center',
  },
});

