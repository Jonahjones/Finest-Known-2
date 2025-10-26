import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../src/components/ui/Button';
import { Card } from '../src/components/ui/Card';
import { useCart } from '../src/hooks/useCart';
import { colors, typography, spacing } from '../src/design/tokens';
import { requestCheckout } from '../src/api/checkout';
import { router } from 'expo-router';

export default function CheckoutScreen() {
  const { cartItems, getTotalPrice, getTotalItems } = useCart();
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
  });
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [processing, setProcessing] = useState(false);

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(cents / 100);
  };

  const handlePlaceOrder = async () => {
    // Validate shipping info
    if (!shippingInfo.firstName || !shippingInfo.lastName || !shippingInfo.address || 
        !shippingInfo.city || !shippingInfo.state || !shippingInfo.zipCode) {
      Alert.alert('Missing Information', 'Please fill in all shipping information.');
      return;
    }

    setProcessing(true);
    
    try {
      // Create order with shipping and payment info
      const result = await requestCheckout();
      
      Alert.alert(
        'Order Placed',
        `Your order #${result.order_id.slice(0, 8)} has been successfully placed!`,
        [{ 
          text: 'OK', 
          onPress: () => {
            // Navigate back to home screen
            router.replace('/(tabs)');
          }
        }]
      );
    } catch (error) {
      console.error('Checkout error:', error);
      Alert.alert('Checkout Failed', 'There was an error processing your order. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const renderCartItem = (item: any) => (
    <View key={item.id} style={styles.cartItem}>
      <View style={styles.itemImage}>
        <View style={styles.imagePlaceholder}>
          <Ionicons name="image" size={24} color={colors.text.tertiary} />
        </View>
      </View>
      
      <View style={styles.itemDetails}>
        <Text style={styles.itemTitle} numberOfLines={2}>
          {item.product?.title || 'Product'}
        </Text>
        <Text style={styles.itemPrice}>
          {formatPrice(item.product?.retail_price_cents || 0)}
        </Text>
        <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Checkout</Text>
        <TouchableOpacity>
          <Ionicons name="close" size={24} color={colors.text.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Shipping Information */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Shipping Information</Text>
          
          <View style={styles.inputRow}>
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="First Name"
              value={shippingInfo.firstName}
              onChangeText={(text) => setShippingInfo(prev => ({ ...prev, firstName: text }))}
            />
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="Last Name"
              value={shippingInfo.lastName}
              onChangeText={(text) => setShippingInfo(prev => ({ ...prev, lastName: text }))}
            />
          </View>
          
          <TextInput
            style={styles.input}
            placeholder="Street Address"
            value={shippingInfo.address}
            onChangeText={(text) => setShippingInfo(prev => ({ ...prev, address: text }))}
          />
          
          <View style={styles.inputRow}>
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="City"
              value={shippingInfo.city}
              onChangeText={(text) => setShippingInfo(prev => ({ ...prev, city: text }))}
            />
            <TextInput
              style={[styles.input, styles.quarterInput]}
              placeholder="State"
              value={shippingInfo.state}
              onChangeText={(text) => setShippingInfo(prev => ({ ...prev, state: text }))}
            />
            <TextInput
              style={[styles.input, styles.quarterInput]}
              placeholder="ZIP"
              value={shippingInfo.zipCode}
              onChangeText={(text) => setShippingInfo(prev => ({ ...prev, zipCode: text }))}
            />
          </View>
        </Card>

        {/* Payment Method */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          
          <TouchableOpacity
            style={[
              styles.paymentOption,
              paymentMethod === 'card' && styles.selectedPayment
            ]}
            onPress={() => setPaymentMethod('card')}
          >
            <Ionicons 
              name="card" 
              size={24} 
              color={paymentMethod === 'card' ? colors.accent : colors.text.secondary} 
            />
            <Text style={[
              styles.paymentText,
              paymentMethod === 'card' && styles.selectedPaymentText
            ]}>
              Credit/Debit Card
            </Text>
            <Ionicons 
              name={paymentMethod === 'card' ? 'radio-button-on' : 'radio-button-off'} 
              size={20} 
              color={paymentMethod === 'card' ? colors.accent : colors.text.secondary} 
            />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.paymentOption,
              paymentMethod === 'paypal' && styles.selectedPayment
            ]}
            onPress={() => setPaymentMethod('paypal')}
          >
            <Ionicons 
              name="logo-paypal" 
              size={24} 
              color={paymentMethod === 'paypal' ? colors.accent : colors.text.secondary} 
            />
            <Text style={[
              styles.paymentText,
              paymentMethod === 'paypal' && styles.selectedPaymentText
            ]}>
              PayPal
            </Text>
            <Ionicons 
              name={paymentMethod === 'paypal' ? 'radio-button-on' : 'radio-button-off'} 
              size={20} 
              color={paymentMethod === 'paypal' ? colors.accent : colors.text.secondary} 
            />
          </TouchableOpacity>
        </Card>

        {/* Order Summary */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          
          {cartItems.map(renderCartItem)}
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal ({getTotalItems()} items)</Text>
            <Text style={styles.summaryValue}>
              {formatPrice(getTotalPrice())}
            </Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Shipping</Text>
            <Text style={styles.summaryValue}>Calculated at checkout</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tax</Text>
            <Text style={styles.summaryValue}>Calculated at checkout</Text>
          </View>
          
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>
              {formatPrice(getTotalPrice())}
            </Text>
          </View>
        </Card>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={processing ? "Processing..." : "Place Order"}
          onPress={handlePlaceOrder}
          disabled={processing}
          style={styles.placeOrderButton}
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
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  
  title: {
    ...typography.title,
    color: colors.text.primary,
  },
  
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  
  section: {
    marginBottom: spacing.lg,
  },
  
  sectionTitle: {
    ...typography.heading,
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },
  
  inputRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: typography.body.fontSize,
    backgroundColor: colors.background,
    marginBottom: spacing.md,
  },
  
  halfInput: {
    flex: 1,
  },
  
  quarterInput: {
    flex: 0.5,
  },
  
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
  },
  
  selectedPayment: {
    borderColor: colors.accent,
    backgroundColor: colors.surface,
  },
  
  paymentText: {
    ...typography.body,
    color: colors.text.secondary,
    marginLeft: spacing.md,
    flex: 1,
  },
  
  selectedPaymentText: {
    color: colors.text.primary,
    fontWeight: '600',
  },
  
  cartItem: {
    flexDirection: 'row',
    marginBottom: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  
  itemImage: {
    width: 60,
    height: 60,
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
  },
  
  itemPrice: {
    ...typography.heading,
    color: colors.primary,
    fontWeight: '700',
  },
  
  itemQuantity: {
    ...typography.caption,
    color: colors.text.secondary,
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
  
  footer: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  
  placeOrderButton: {
    width: '100%',
  },
});
