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

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    // Fallback to local storage
    try {
      const wishlistString = await import('@react-native-async-storage/async-storage').then(m => 
        m.default.getItem(WISHLIST_STORAGE_KEY)
      );
      const wishlist: string[] = wishlistString ? JSON.parse(wishlistString) : [];
      if (!wishlist.includes(productId)) {
        wishlist.push(productId);
        await import('@react-native-async-storage/async-storage').then(m => 
          m.default.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist))
        );
      }
    } catch (e) {
      console.error('Error adding to local wishlist:', e);
    }
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

    const { error } = await supabase
      .from('wishlist')
      .delete()
      .eq('user_id', user.id)
      .eq('product_id', productId);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    // Fallback to local storage
    try {
      const wishlistString = await import('@react-native-async-storage/async-storage').then(m => 
        m.default.getItem(WISHLIST_STORAGE_KEY)
      );
      const wishlist: string[] = wishlistString ? JSON.parse(wishlistString) : [];
      const filtered = wishlist.filter(id => id !== productId);
      await import('@react-native-async-storage/async-storage').then(m => 
        m.default.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(filtered))
      );
    } catch (e) {
      console.error('Error removing from local wishlist:', e);
    }
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

    const { data } = await supabase
      .from('wishlist')
      .select('*')
      .eq('user_id', user.id)
      .eq('product_id', productId)
      .single();

    return !!data;
  } catch (error) {
    // Check local storage
    try {
      const wishlistString = await import('@react-native-async-storage/async-storage').then(m => 
        m.default.getItem(WISHLIST_STORAGE_KEY)
      );
      const wishlist: string[] = wishlistString ? JSON.parse(wishlistString) : [];
      return wishlist.includes(productId);
    } catch (e) {
      return false;
    }
  }
}

// Get all wishlist items
export async function getWishlistItems(): Promise<WishlistItem[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return [];
    }

    const { data, error } = await supabase
      .from('wishlist')
      .select(`
        *,
        product:products(*)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return (data || []).map((item: any) => ({
      id: item.id,
      product_id: item.product_id,
      user_id: item.user_id,
      created_at: item.created_at,
      product: item.product,
    }));
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    return [];
  }
}

