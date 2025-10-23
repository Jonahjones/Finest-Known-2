import { supabase } from '../lib/supabase';
import { Article } from './types';

export async function listArticles(params?: {
  category?: Article['category'];
  limit?: number;
  offset?: number;
}): Promise<Article[]> {
  try {
    let query = supabase
      .from('articles')
      .select('*')
      .eq('is_published', true)
      .order('published_at', { ascending: false });

    if (params?.category) {
      query = query.eq('category', params.category);
    }

    if (params?.limit) {
      query = query.limit(params.limit);
    }

    if (params?.offset) {
      query = query.range(params.offset, params.offset + (params.limit || 10) - 1);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching articles:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error in listArticles:', error);
    throw error;
  }
}

export async function getArticle(idOrSlug: string): Promise<Article | null> {
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .or(`id.eq.${idOrSlug},slug.eq.${idOrSlug}`)
      .eq('is_published', true)
      .single();

    if (error) {
      console.error('Error fetching article:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getArticle:', error);
    return null;
  }
}

export async function listFeaturedArticles(limit?: number): Promise<Article[]> {
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('is_published', true)
      .eq('is_featured', true)
      .order('published_at', { ascending: false })
      .limit(limit || 5);

    if (error) {
      console.error('Error fetching featured articles:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error in listFeaturedArticles:', error);
    throw error;
  }
}

export async function listResourceArticles(resourceType: string, limit?: number): Promise<Article[]> {
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('is_published', true)
      .eq('resource_type', resourceType)
      .order('published_at', { ascending: false })
      .limit(limit || 10);

    if (error) {
      console.error('Error fetching resource articles:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error in listResourceArticles:', error);
    throw error;
  }
}
