import { supabase } from '../lib/supabase';
import { Product } from './types';

export interface WishlistItem {
  id: string;
  product_id: string;
  user_id: string;
  created_at: string;
  product?: Product;
}

const WISHLIST_STORAGE_KEY = 'finestknown_wishlist';

// Add item to wishlist
export async function addToWishlist(productId: string): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Try to add to database first
    try {
      // Check if already in wishlist
      const { data: existingItem } = await supabase
        .from('wishlist')
        .select('*')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .maybeSingle();

      if (existingItem) {
        return; // Already in wishlist
      }

      // Add to database
      const { error } = await supabase
        .from('wishlist')
        .insert({
          user_id: user.id,
          product_id: productId,
        });

      if (error && error.code !== 'PGRST205') { // Table doesn't exist
        throw error;
      }
    } catch (dbError) {
      console.warn('Database wishlist not available, using local storage:', dbError);
    }

    // Always fallback to local storage for now
    const AsyncStorage = await import('@react-native-async-storage/async-storage').then(m => m.default);
    const wishlistString = await AsyncStorage.getItem(WISHLIST_STORAGE_KEY);
    const wishlist: string[] = wishlistString ? JSON.parse(wishlistString) : [];
    if (!wishlist.includes(productId)) {
      wishlist.push(productId);
      await AsyncStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
    }
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    throw error;
  }
}

// Remove item from wishlist
export async function removeFromWishlist(productId: string): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Try database first
    try {
      const { error } = await supabase
        .from('wishlist')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (error && error.code !== 'PGRST205') {
        throw error;
      }
    } catch (dbError) {
      console.warn('Database wishlist not available, using local storage:', dbError);
    }

    // Always fallback to local storage
    const AsyncStorage = await import('@react-native-async-storage/async-storage').then(m => m.default);
    const wishlistString = await AsyncStorage.getItem(WISHLIST_STORAGE_KEY);
    const wishlist: string[] = wishlistString ? JSON.parse(wishlistString) : [];
    const filtered = wishlist.filter(id => id !== productId);
    await AsyncStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    throw error;
  }
}

// Check if item is in wishlist
export async function isInWishlist(productId: string): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return false;
    }

    // Try database first
    try {
      const { data } = await supabase
        .from('wishlist')
        .select('*')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .maybeSingle();

      if (data) {
        return true;
      }
    } catch (dbError) {
      // If table doesn't exist, fall through to local storage
    }

    // Check local storage
    const AsyncStorage = await import('@react-native-async-storage/async-storage').then(m => m.default);
    const wishlistString = await AsyncStorage.getItem(WISHLIST_STORAGE_KEY);
    const wishlist: string[] = wishlistString ? JSON.parse(wishlistString) : [];
    return wishlist.includes(productId);
  } catch (error) {
    return false;
  }
}

// Get all wishlist items
export async function getWishlistItems(): Promise<WishlistItem[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return [];
    }

    // Try database first
    try {
      const { data, error } = await supabase
        .from('wishlist')
        .select(`
          *,
          product:products(*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        return (data || []).map((item: any) => ({
          id: item.id,
          product_id: item.product_id,
          user_id: item.user_id || item.user_id,
          created_at: item.created_at,
          product: item.product,
        }));
      }
    } catch (dbError) {
      console.warn('Database wishlist not available, using local storage:', dbError);
    }

    // Fallback to local storage
    const AsyncStorage = await import('@react-native-async-storage/async-storage').then(m => m.default);
    const wishlistString = await AsyncStorage.getItem(WISHLIST_STORAGE_KEY);
    const wishlist: string[] = wishlistString ? JSON.parse(wishlistString) : [];
    
    if (wishlist.length === 0) {
      return [];
    }

    // Fetch product details for each product ID
    try {
      const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .in('id', wishlist);

      if (error) {
        console.error('Error fetching products:', error);
        return [];
      }

      // Create a map of product ID to product data
      const productMap = new Map();
      (products || []).forEach((product: any) => {
        productMap.set(product.id, product);
      });

      // Convert to WishlistItem format with product details
      return wishlist.map((productId, index) => ({
        id: `local-${index}`,
        product_id: productId,
        user_id: user.id,
        created_at: new Date().toISOString(),
        product: productMap.get(productId) || undefined,
      }));
    } catch (fetchError) {
      console.error('Error fetching product details:', fetchError);
      return [];
    }
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    return [];
  }
}

