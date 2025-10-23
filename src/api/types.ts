// API Types for FinestKnown app

export interface Product {
  id: string;
  title: string;
  description: string | null;
  sku: string | null;
  category_id: string;
  metal_type: string;
  weight_grams: number | null;
  purity: number | null;
  year: number | null;
  mint: string | null;
  grade: string | null;
  cert_number: string | null;
  retail_price_cents: number;
  market_price_cents: number | null;
  last_sale_cents: number | null;
  primary_image_url: string | null;
  image_urls: string[];
  size: string | null;
  condition: string;
  authenticity_guaranteed: boolean;
  is_active: boolean;
  is_featured: boolean;
  is_auction: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface LivePrice {
  id: string;
  metal_type: string;
  price_per_ounce_cents: number;
  change_cents: number;
  change_percent: number;
  last_updated: string;
}

export interface CartItem {
  id: string;
  cart_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  product?: Product;
}

export interface Order {
  id: string;
  user_id: string;
  total_cents: number;
  shipping_address: any;
  billing_address: any;
  payment_intent_id: string | null;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price_cents: number;
  created_at: string;
}

export interface Auction {
  id: string;
  product_id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  start_time: string;
  end_time: string;
  starting_bid_cents: number;
  current_bid_cents: number | null;
  reserve_price_cents: number | null;
  winner_user_id: string | null;
  bid_increment_cents: number;
  status: 'scheduled' | 'live' | 'ended' | 'cancelled';
  created_at: string;
  updated_at: string;
  product?: Product;
}

export interface AuctionBid {
  id: string;
  auction_id: string;
  user_id: string;
  amount_cents: number;
  is_winning: boolean;
  created_at: string;
}

export interface Article {
  id: string;
  created_at: string;
  updated_at: string;
  slug: string;
  title: string;
  excerpt: string | null;
  category: 'Market' | 'Education' | 'Ancients' | 'Treasure' | 'Collectibles' | 'Goldbacks' | 'Authentication' | 'Storage';
  author: string;
  read_minutes: number;
  cover_url: string | null;
  body_md: string;
  published_at: string;
  is_featured: boolean;
  meta_title: string | null;
  meta_description: string | null;
  resource_type?: string | null;
  display_date?: string | null;
}

export interface FlashSaleItem {
  id: string;
  slug: string;
  name: string;
  imageUrl: string;
  basePrice: number;
  salePrice: number;
  percentOff: number;
  endsAt: string;
  inventory: number;
}

export interface Discount {
  id: string;
  item_id: string;
  type: 'PERCENT' | 'AMOUNT';
  value: number;
  starts_at: string;
  ends_at: string;
  is_featured: boolean;
  active: boolean;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
}

export interface FlashSalesResponse {
  items: FlashSaleItem[];
  total: number;
}
