import { supabase } from '../lib/supabase';
import { Product, Category } from './types';
import { demoProducts } from '../data/demoData';

export async function getProducts(filters?: {
  category?: string;
  metalType?: string;
  featured?: boolean;
  limit?: number;
}): Promise<Product[]> {
  try {
    // Try to fetch from Supabase first
    let query = supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (filters?.category) {
      query = query.eq('category_id', filters.category);
    }

    if (filters?.metalType) {
      query = query.eq('metal_type', filters.metalType);
    }

    if (filters?.featured) {
      query = query.eq('is_featured', true);
    }

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    const { data, error } = await query;

    if (error) {
      console.warn('Supabase not available, using demo data:', error.message);
      // Fallback to demo data
      let products = demoProducts;
      
      if (filters?.metalType) {
        const metalType = filters.metalType;
        products = products.filter(p => p.metal_type.toLowerCase() === metalType.toLowerCase());
      }
      
      if (filters?.featured) {
        products = products.filter(p => p.is_featured);
      }
      
      if (filters?.limit) {
        products = products.slice(0, filters.limit);
      }
      
      return products;
    }

    return data || [];
  } catch (error) {
    console.warn('Error fetching products, using demo data:', error);
    // Fallback to demo data
    let products = demoProducts;
    
    if (filters?.metalType) {
      const metalType = filters.metalType;
      products = products.filter(p => p.metal_type.toLowerCase() === metalType.toLowerCase());
    }
    
    if (filters?.featured) {
      products = products.filter(p => p.is_featured);
    }
    
    if (filters?.limit) {
      products = products.slice(0, filters.limit);
    }
    
    return products;
  }
}

export async function getProduct(id: string): Promise<Product | null> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single();

    if (error) {
      console.error('Error fetching product:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getProduct:', error);
    return null;
  }
}

export async function getCategories(): Promise<Category[]> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error in getCategories:', error);
    throw error;
  }
}

export async function searchProducts(query: string): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .or(`title.ilike.%${query}%,description.ilike.%${query}%,metal_type.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error searching products:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error in searchProducts:', error);
    throw error;
  }
}

/**
 * Update all products to have PCGS number 7660
 * This ensures every product has the PCGS coin type number set in the database
 * Note: This requires the pcgs_no column to exist in the products table.
 * If the column doesn't exist, run the SQL script update_all_products_pcgs_7660.sql first.
 */
export async function updateAllProductsWithPCGS7660(): Promise<{ 
  success: boolean; 
  updated: number; 
  error?: string;
}> {
  try {
    // First, try to get all products to check if pcgs_no column exists
    const { data: products, error: fetchError } = await supabase
      .from('products')
      .select('id');
    
    if (fetchError) {
      // Check if error is due to missing column
      if (fetchError.code === '42703' || (typeof fetchError.message === 'string' && fetchError.message.includes('column') && fetchError.message.includes('does not exist'))) {
        return { 
          success: false, 
          updated: 0, 
          error: 'pcgs_no column does not exist. Please run the SQL script update_all_products_pcgs_7660.sql in Supabase SQL editor first to add the column, then run this function again.' 
        };
      }
      console.error('Error fetching products:', fetchError);
      return { success: false, updated: 0, error: fetchError.message };
    }
    
    if (!products || products.length === 0) {
      return { success: true, updated: 0 };
    }
    
    // Update all products - set pcgs_no to 7660 for products that don't have it
    // Note: Supabase doesn't support .neq() with .or(), so we update all and let SQL handle it
    // Or we update in batches by fetching products that need updating
    
    // Get products that need updating (where pcgs_no is not 7660 or is null)
    const { data: productsToUpdate, error: selectError } = await supabase
      .from('products')
      .select('id')
      .or('pcgs_no.neq.7660,pcgs_no.is.null');
    
    if (selectError) {
      // If column doesn't exist, that's the error
      if (selectError.code === '42703' || (typeof selectError.message === 'string' && selectError.message.includes('column'))) {
        return { 
          success: false, 
          updated: 0, 
          error: 'pcgs_no column does not exist. Please run the SQL script update_all_products_pcgs_7660.sql in Supabase SQL editor first.' 
        };
      }
      // If OR condition doesn't work, try updating all products
    }
    
    const productsNeedingUpdate = productsToUpdate || products;
    
    // Update products - use a simple update that works with Supabase
    // Update all products where pcgs_no is not 7660
    const { data: updateData, error: updateError } = await supabase
      .from('products')
      .update({ 
        pcgs_no: 7660,
        updated_at: new Date().toISOString()
      })
      .neq('pcgs_no', 7660)
      .select('id');
    
    let updatedCount = updateData?.length || 0;
    
    // Also update products where pcgs_no is null (if the above doesn't catch them)
    if (updatedCount < productsNeedingUpdate.length) {
      const { data: nullUpdateData, error: nullUpdateError } = await supabase
        .from('products')
        .update({ 
          pcgs_no: 7660,
          updated_at: new Date().toISOString()
        })
        .is('pcgs_no', null)
        .select('id');
      
      if (!nullUpdateError && nullUpdateData) {
        updatedCount += nullUpdateData.length;
      }
    }
    
    if (updateError && updateError.code !== '42703') {
      console.error('Error updating products:', updateError);
      // Continue anyway - we tried
    }
    
    console.log(`✅ Updated ${updatedCount} products with PCGS number 7660`);
    
    return { success: true, updated: updatedCount };
  } catch (error) {
    console.error('Error in updateAllProductsWithPCGS7660:', error);
    return { 
      success: false, 
      updated: 0, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}