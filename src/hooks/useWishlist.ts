import { useState, useEffect } from 'react';
import { 
  addToWishlist as addToWishlistAPI, 
  removeFromWishlist as removeFromWishlistAPI,
  isInWishlist as isInWishlistAPI,
  getWishlistItems,
  WishlistItem 
} from '../api/wishlist';

export function useWishlist() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWishlistItems = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const items = await getWishlistItems();
      console.log('Fetched wishlist items:', items.length, items);
      setWishlistItems(items);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch wishlist');
      console.error('Error fetching wishlist:', err);
      setWishlistItems([]);
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (productId: string) => {
    try {
      await addToWishlistAPI(productId);
      await fetchWishlistItems();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add item to wishlist');
      console.error('Error adding to wishlist:', err);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    try {
      await removeFromWishlistAPI(productId);
      await fetchWishlistItems();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove item from wishlist');
      console.error('Error removing from wishlist:', err);
    }
  };

  const isInWishlist = async (productId: string): Promise<boolean> => {
    try {
      return await isInWishlistAPI(productId);
    } catch (err) {
      console.error('Error checking wishlist:', err);
      return false;
    }
  };

  useEffect(() => {
    fetchWishlistItems();
  }, []);

  return {
    wishlistItems,
    loading,
    error,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    refreshWishlist: fetchWishlistItems,
  };
}

