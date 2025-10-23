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
        products = products.filter(p => p.metal_type.toLowerCase() === filters.metalType.toLowerCase());
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
      products = products.filter(p => p.metal_type.toLowerCase() === filters.metalType.toLowerCase());
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
