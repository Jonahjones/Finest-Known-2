import { supabase } from '../lib/supabase';
import { FlashSaleItem, Discount, FlashSalesResponse } from './types';

export async function getActiveFlashSales(limit?: number): Promise<FlashSalesResponse> {
  try {
    const { data, error } = await supabase
      .from('discounts')
      .select(`
        *,
        product:products(*)
      `)
      .eq('active', true)
      .gte('ends_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(limit || 10);

    if (error) {
      console.error('Error fetching flash sales:', error);
      throw error;
    }

    const items: FlashSaleItem[] = (data || []).map((discount: any) => ({
      id: discount.id,
      slug: discount.product?.slug || '',
      name: discount.product?.title || '',
      imageUrl: discount.product?.primary_image_url || '',
      basePrice: discount.product?.retail_price_cents || 0,
      salePrice: calculateSalePrice(
        discount.product?.retail_price_cents || 0,
        discount.type,
        discount.value
      ),
      percentOff: discount.type === 'PERCENT' ? discount.value : 0,
      endsAt: discount.ends_at,
      inventory: 10, // Mock inventory
    }));

    return {
      items,
      total: items.length,
    };
  } catch (error) {
    console.error('Error in getActiveFlashSales:', error);
    throw error;
  }
}

export async function getProductDiscounts(itemId: string): Promise<Discount[]> {
  try {
    const { data, error } = await supabase
      .from('discounts')
      .select('*')
      .eq('item_id', itemId)
      .eq('active', true)
      .gte('ends_at', new Date().toISOString())
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching product discounts:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error in getProductDiscounts:', error);
    throw error;
  }
}

export async function getCurrentSalePrice(itemId: string): Promise<{ basePrice: number; salePrice: number; percentOff: number } | null> {
  try {
    const discounts = await getProductDiscounts(itemId);
    
    if (discounts.length === 0) {
      return null;
    }

    const discount = discounts[0]; // Get the first active discount
    const basePrice = discount.item_id ? 0 : 0; // Would need to fetch product price
    
    const salePrice = calculateSalePrice(basePrice, discount.type, discount.value);
    const percentOff = discount.type === 'PERCENT' ? discount.value : 0;

    return {
      basePrice,
      salePrice,
      percentOff,
    };
  } catch (error) {
    console.error('Error in getCurrentSalePrice:', error);
    return null;
  }
}

function calculateSalePrice(basePrice: number, discountType: 'PERCENT' | 'AMOUNT', value: number): number {
  if (discountType === 'AMOUNT') {
    return Math.max(0, basePrice - value);
  } else {
    const discountAmount = basePrice * (value / 100);
    return Math.max(0, basePrice - discountAmount);
  }
}
