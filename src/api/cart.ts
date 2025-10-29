import { supabase } from '../lib/supabase';
import { CartItem, Product } from './types';

const CART_STORAGE_KEY = 'finestknown_cart';

export async function getOrCreateCart() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      // Silent return for unauthenticated users - cart requires auth
      return null;
    }

    // Check if user already has a cart
    const { data: existingCart, error: cartError } = await supabase
      .from('carts')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (cartError && cartError.code !== 'PGRST116') {
      throw cartError;
    }

    if (existingCart) {
      return existingCart;
    }

    // Create new cart
    const { data: newCart, error: createError } = await supabase
      .from('carts')
      .insert({ user_id: user.id })
      .select()
      .single();

    if (createError) {
      throw createError;
    }

    return newCart;
  } catch (error) {
    // Only log actual errors, not auth issues
    if (error instanceof Error && !error.message.includes('authenticated')) {
      console.error('Error in getOrCreateCart:', error);
    }
    return null;
  }
}

export async function addToCart(productId: string, qty: number, price_cents?: number) {
  try {
    const cart = await getOrCreateCart();
    
    // Check if item already exists in cart
    const { data: existingItem, error: checkError } = await supabase
      .from('cart_items')
      .select('*')
      .eq('cart_id', cart.id)
      .eq('product_id', productId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError;
    }

    if (existingItem) {
      // Update quantity
      const { error: updateError } = await supabase
        .from('cart_items')
        .update({ quantity: existingItem.quantity + qty })
        .eq('id', existingItem.id);

      if (updateError) {
        throw updateError;
      }
    } else {
      // Add new item
      const { error: insertError } = await supabase
        .from('cart_items')
        .insert({
          cart_id: cart.id,
          product_id: productId,
          quantity: qty,
        });

      if (insertError) {
        throw insertError;
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Error in addToCart:', error);
    throw error;
  }
}

export async function listCartItems(): Promise<CartItem[]> {
  try {
    const cart = await getOrCreateCart();
    
    if (!cart) {
      return []; // No cart for unauthenticated users
    }
    
    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        *,
        product:products(*)
      `)
      .eq('cart_id', cart.id)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    // Silently return empty array for errors (like auth issues)
    return [];
  }
}

export async function removeFromCart(productId: string) {
  try {
    const cart = await getOrCreateCart();
    
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('cart_id', cart.id)
      .eq('product_id', productId);

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error('Error in removeFromCart:', error);
    throw error;
  }
}

export async function updateCartItemQuantity(productId: string, qty: number) {
  try {
    const cart = await getOrCreateCart();
    
    if (qty <= 0) {
      return removeFromCart(productId);
    }

    const { error } = await supabase
      .from('cart_items')
      .update({ quantity: qty })
      .eq('cart_id', cart.id)
      .eq('product_id', productId);

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error('Error in updateCartItemQuantity:', error);
    throw error;
  }
}

export async function clearCart() {
  try {
    const cart = await getOrCreateCart();
    
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('cart_id', cart.id);

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error('Error in clearCart:', error);
    throw error;
  }
}

export async function removeSoldItemsFromCart(): Promise<string[]> {
  try {
    const cartItems = await listCartItems();
    const soldOutItems: string[] = [];

    for (const item of cartItems) {
      if (item.product && !item.product.is_active) {
        await removeFromCart(item.product_id);
        soldOutItems.push(item.product_id);
      }
    }

    return soldOutItems;
  } catch (error) {
    console.error('Error in removeSoldItemsFromCart:', error);
    throw error;
  }
}
