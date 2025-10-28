import { supabase } from '../lib/supabase';
import { CartItem } from './types';

export async function finalizeOrder(cartItems: any[]): Promise<void> {
  try {
    // Inventory tracking would go here if needed
    // For now, we'll just log the completion
    console.log('Order finalized:', cartItems.length, 'items');
    // Note: No inventory decrement for now since products don't have stock tracking
  } catch (error) {
    console.error('Error in finalizeOrder:', error);
    throw error;
  }
}

export async function requestCheckout(shippingAddress?: any): Promise<{ order_id: string; total_cents: number }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Get cart items
    const { data: cart } = await supabase
      .from('carts')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!cart) {
      throw new Error('Cart not found');
    }

    const { data: cartItems, error: cartItemsError } = await supabase
      .from('cart_items')
      .select(`
        *,
        product:products(*)
      `)
      .eq('cart_id', cart.id);

    if (cartItemsError) {
      throw cartItemsError;
    }

    if (!cartItems || cartItems.length === 0) {
      throw new Error('Cart is empty');
    }

    // Calculate total
    const total_cents = cartItems.reduce((sum, item) => {
      return sum + (item.product.retail_price_cents * item.quantity);
    }, 0);

    // Create order with shipping address
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        total_cents,
        status: 'confirmed',
        shipping_address: shippingAddress || null,
      })
      .select()
      .single();

    if (orderError) {
      throw orderError;
    }

    // Create order items
    const orderItems = cartItems.map(item => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price_cents: item.product.retail_price_cents,
    }));

    const { error: orderItemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (orderItemsError) {
      throw orderItemsError;
    }

    // Decrement stock
    await finalizeOrder(cartItems);

    // Clear cart
    await supabase
      .from('cart_items')
      .delete()
      .eq('cart_id', cart.id);

    return { order_id: order.id, total_cents };
  } catch (error) {
    console.error('Error in requestCheckout:', error);
    throw error;
  }
}

export async function getUserOrders(): Promise<any[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items(
          *,
          product:products(*)
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error in getUserOrders:', error);
    throw error;
  }
}

export async function requestDirectPurchase(productId: string, quantity: number): Promise<{ order_id: string; total_cents: number }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Get product details
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .eq('is_active', true)
      .single();

    if (productError || !product) {
      throw new Error('Product not found');
    }

    const total_cents = product.retail_price_cents * quantity;

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        total_cents,
        status: 'pending',
      })
      .select()
      .single();

    if (orderError) {
      throw orderError;
    }

    // Create order item
    const { error: orderItemError } = await supabase
      .from('order_items')
      .insert({
        order_id: order.id,
        product_id: productId,
        quantity,
        price_cents: product.retail_price_cents,
      });

    if (orderItemError) {
      throw orderItemError;
    }

    // Decrement stock
    await finalizeOrder([{ product_id: productId, quantity }]);

    return { order_id: order.id, total_cents };
  } catch (error) {
    console.error('Error in requestDirectPurchase:', error);
    throw error;
  }
}
