import { useState, useEffect } from 'react';
import { getWishlistItems } from '../api/wishlist';

export function useWishlistCount() {
  const [wishlistItemCount, setWishlistItemCount] = useState(0);
  
  useEffect(() => {
    const fetchWishlistItems = async () => {
      try {
        const items = await getWishlistItems();
        setWishlistItemCount(items.length);
      } catch (error) {
        setWishlistItemCount(0);
      }
    };
    
    fetchWishlistItems();
    
    // Refresh wishlist count periodically
    const interval = setInterval(fetchWishlistItems, 2000);
    
    return () => clearInterval(interval);
  }, []);

  return wishlistItemCount;
}

