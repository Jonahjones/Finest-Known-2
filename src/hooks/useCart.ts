import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { listCartItems } from '../api/cart';
import { CartItem } from '../api/types';

const CART_STORAGE_KEY = 'finestknown_cart';

export function useCartItemCount() {
  const [cartItemCount, setCartItemCount] = useState(0);
  
  useEffect(() => {
    // For demo purposes, just use local storage instead of requiring auth
    const fetchCartItems = async () => {
      try {
        const cartItemsString = await AsyncStorage.getItem(CART_STORAGE_KEY);
        if (cartItemsString) {
          const cartItems = JSON.parse(cartItemsString);
          setCartItemCount(cartItems.length);
        } else {
          setCartItemCount(0);
        }
      } catch (storageError) {
        console.error('Failed to fetch cart items from storage', storageError);
        setCartItemCount(0);
      }
    };
    
    fetchCartItems();
  }, []);

  return cartItemCount;
}

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCartItems = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // For demo purposes, use local storage instead of requiring auth
      const cartItemsString = await AsyncStorage.getItem(CART_STORAGE_KEY);
      if (cartItemsString) {
        const items = JSON.parse(cartItemsString);
        setCartItems(items);
      } else {
        setCartItems([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch cart items');
      console.error('Error fetching cart items:', err);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId: string, quantity: number = 1) => {
    try {
      const { addToCart: addToCartAPI } = await import('../api/cart');
      await addToCartAPI(productId, quantity);
      await fetchCartItems(); // Refresh cart items
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add item to cart');
      console.error('Error adding to cart:', err);
    }
  };

  const removeFromCart = async (productId: string) => {
    try {
      const { removeFromCart: removeFromCartAPI } = await import('../api/cart');
      await removeFromCartAPI(productId);
      await fetchCartItems(); // Refresh cart items
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove item from cart');
      console.error('Error removing from cart:', err);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    try {
      const { updateCartItemQuantity } = await import('../api/cart');
      await updateCartItemQuantity(productId, quantity);
      await fetchCartItems(); // Refresh cart items
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update quantity');
      console.error('Error updating quantity:', err);
    }
  };

  const clearCart = async () => {
    try {
      const { clearCart: clearCartAPI } = await import('../api/cart');
      await clearCartAPI();
      setCartItems([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clear cart');
      console.error('Error clearing cart:', err);
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      if (item.product) {
        return total + (item.product.retail_price_cents * item.quantity);
      }
      return total;
    }, 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  return {
    cartItems,
    loading,
    error,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    refreshCart: fetchCartItems,
    getTotalPrice,
    getTotalItems,
  };
}
