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
    
    // Reduced polling frequency from 2 seconds to 60 seconds for better performance
    const interval = setInterval(fetchWishlistItems, 60000);
    
    return () => clearInterval(interval);
  }, []);

  return wishlistItemCount;
}

