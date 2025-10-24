import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../../src/hooks/useCart';
import { Button } from '../../src/components/ui/Button';
import { Card } from '../../src/components/ui/Card';
import { useTheme } from '../../src/theme/ThemeProvider';

export default function CartScreen() {
  const { isLuxeTheme, tokens } = useTheme();
  const {
    cartItems,
    loading,
    error,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
  } = useCart();

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(cents / 100);
  };

  const handleRemoveItem = (productId: string, productTitle: string) => {
    Alert.alert(
      'Remove Item',
      `Remove "${productTitle}" from your cart?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: () => removeFromCart(productId)
        },
      ]
    );
  };

  const handleClearCart = () => {
    Alert.alert(
      'Clear Cart',
      'Remove all items from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive',
          onPress: clearCart
        },
      ]
    );
  };

  const handleCheckout = () => {
    // Navigate to checkout screen
    console.log('Navigate to checkout');
  };

  const renderCartItem = ({ item }: { item: any }) => (
    <Card style={styles.cartItem}>
      <View style={styles.itemImage}>
        {/* Placeholder for product image */}
        <View style={styles.imagePlaceholder}>
          <Ionicons name="image" size={32} color={colors.text.tertiary} />
        </View>
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
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => updateQuantity(item.product_id, item.quantity - 1)}
            disabled={item.quantity <= 1}
          >
            <Ionicons name="remove" size={16} color={colors.text.primary} />
          </TouchableOpacity>
          
          <Text style={styles.quantityText}>{item.quantity}</Text>
          
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => updateQuantity(item.product_id, item.quantity + 1)}
          >
            <Ionicons name="add" size={16} color={colors.text.primary} />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleRemoveItem(item.product_id, item.product?.title)}
        >
          <Ionicons name="trash-outline" size={20} color={colors.error} />
        </TouchableOpacity>
      </View>
    </Card>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading cart...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color={colors.error} />
          <Text style={styles.errorTitle}>Error loading cart</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <Button
            title="Try Again"
            onPress={() => window.location.reload()}
            style={styles.retryButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  if (cartItems.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Ionicons name="bag-outline" size={64} color={colors.text.tertiary} />
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySubtitle}>
            Add some precious metals to get started
          </Text>
          <Button
            title="Browse Products"
            onPress={() => {}}
            style={styles.browseButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <Text style={styles.title}>Shopping Cart</Text>
        <TouchableOpacity onPress={handleClearCart}>
          <Text style={styles.clearText}>Clear All</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={cartItems}
        renderItem={renderCartItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.cartList}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.footer}>
        <Card style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Items ({getTotalItems()})</Text>
            <Text style={styles.summaryValue}>
              {formatPrice(getTotalPrice())}
            </Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Shipping</Text>
            <Text style={styles.summaryValue}>Calculated at checkout</Text>
          </View>
          
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>
              {formatPrice(getTotalPrice())}
            </Text>
          </View>
        </Card>

        <Button
          title="Proceed to Checkout"
          onPress={handleCheckout}
          style={styles.checkoutButton}
        />
      </View>
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
    ...typography.title,
    color: colors.text.primary,
  },
  
  clearText: {
    ...typography.caption,
    color: colors.error,
    fontWeight: '600',
  },
  
  cartList: {
    padding: spacing.lg,
    paddingTop: 0,
  },
  
  cartItem: {
    flexDirection: 'row',
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  
  itemImage: {
    width: 80,
    height: 80,
    marginRight: spacing.md,
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
    ...typography.body,
    color: colors.text.primary,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  
  itemPrice: {
    ...typography.heading,
    color: colors.primary,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  
  itemMetal: {
    ...typography.caption,
    color: colors.text.secondary,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  
  itemActions: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 20,
    paddingHorizontal: spacing.sm,
    marginBottom: spacing.sm,
  },
  
  quantityButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  quantityText: {
    ...typography.body,
    color: colors.text.primary,
    fontWeight: '600',
    marginHorizontal: spacing.sm,
    minWidth: 20,
    textAlign: 'center',
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
  
  summaryCard: {
    marginBottom: spacing.lg,
  },
  
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  
  summaryLabel: {
    ...typography.body,
    color: colors.text.secondary,
  },
  
  summaryValue: {
    ...typography.body,
    color: colors.text.primary,
    fontWeight: '600',
  },
  
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
    marginTop: spacing.sm,
  },
  
  totalLabel: {
    ...typography.heading,
    color: colors.text.primary,
    fontWeight: '700',
  },
  
  totalValue: {
    ...typography.heading,
    color: colors.primary,
    fontWeight: '700',
  },
  
  checkoutButton: {
    width: '100%',
  },
  
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  loadingText: {
    ...typography.body,
    color: colors.text.secondary,
  },
  
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  
  errorTitle: {
    ...typography.heading,
    color: colors.text.primary,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  
  errorMessage: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  
  retryButton: {
    minWidth: 120,
  },
  
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  
  emptyTitle: {
    ...typography.title,
    color: colors.text.primary,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  
  emptySubtitle: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing['2xl'],
  },
  
  browseButton: {
    minWidth: 200,
  },
});
