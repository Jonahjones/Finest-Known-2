-- FinestKnown Database Schema
-- Precious metals marketplace with persona-driven personalization

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Categories table
CREATE TABLE categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  image_url TEXT NOT NULL,
  persona_tags TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  sort_weight INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Items table
CREATE TABLE items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  price_cents INTEGER NOT NULL,
  currency TEXT DEFAULT 'USD',
  certification TEXT,
  image_url TEXT NOT NULL,
  persona_tags TEXT[] DEFAULT '{}',
  is_published BOOLEAN DEFAULT false,
  featured_score NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Item images table for multiple images per item
CREATE TABLE item_images (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  item_id UUID REFERENCES items(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Live metal prices table (existing)
CREATE TABLE IF NOT EXISTS live_metal_prices (
  id TEXT PRIMARY KEY,
  metal_type TEXT NOT NULL,
  price NUMERIC NOT NULL,
  change NUMERIC DEFAULT 0,
  change_percent NUMERIC DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample categories
INSERT INTO categories (slug, name, image_url, persona_tags, sort_weight) VALUES
('bullion', 'Bullion & Precious Metals', 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=300&fit=crop', ARRAY['precious_metal_investor', 'tangible_asset_buyer'], 100),
('ancient-coins', 'Ancient & Historical Coins', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop', ARRAY['collector'], 90),
('shipwreck', 'Shipwreck & Treasure Finds', 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop', ARRAY['collector', 'explorer'], 80),
('graded-sets', 'Graded Sets & Collections', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop', ARRAY['collector'], 70),
('bundles', 'Curated Bundles', 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop', ARRAY['tangible_asset_buyer', 'explorer'], 60);

-- Insert sample items
INSERT INTO items (category_id, title, subtitle, description, price_cents, currency, certification, image_url, persona_tags, is_published, featured_score) VALUES
-- Bullion items
((SELECT id FROM categories WHERE slug = 'bullion'), '1oz Gold American Eagle', '2024 BU', 'Brilliant Uncirculated 1oz Gold American Eagle coin from the US Mint', 265000, 'USD', 'US Mint', 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=400&fit=crop', ARRAY['precious_metal_investor', 'tangible_asset_buyer'], true, 95),
((SELECT id FROM categories WHERE slug = 'bullion'), '10oz Silver Bar', 'Johnson Matthey', '10oz Silver Bar from Johnson Matthey, .999 fine silver', 35000, 'USD', 'Johnson Matthey', 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=400&fit=crop', ARRAY['precious_metal_investor', 'tangible_asset_buyer'], true, 90),
((SELECT id FROM categories WHERE slug = 'bullion'), '1oz Platinum Maple Leaf', '2024 BU', '1oz Platinum Maple Leaf coin from Royal Canadian Mint', 120000, 'USD', 'RCM', 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=400&fit=crop', ARRAY['precious_metal_investor'], true, 85),

-- Ancient coins
((SELECT id FROM categories WHERE slug = 'ancient-coins'), 'Roman Denarius', 'Emperor Trajan', 'Silver denarius from Emperor Trajan, 98-117 AD', 45000, 'USD', 'NGC Certified', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop', ARRAY['collector'], true, 92),
((SELECT id FROM categories WHERE slug = 'ancient-coins'), 'Greek Tetradrachm', 'Athens Owl', 'Silver tetradrachm from Athens, 5th century BC', 85000, 'USD', 'NGC Certified', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop', ARRAY['collector'], true, 88),
((SELECT id FROM categories WHERE slug = 'ancient-coins'), 'Byzantine Solidus', 'Emperor Justinian', 'Gold solidus from Emperor Justinian I, 527-565 AD', 125000, 'USD', 'NGC Certified', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop', ARRAY['collector'], true, 90),

-- Shipwreck finds
((SELECT id FROM categories WHERE slug = 'shipwreck'), 'Spanish Doubloon', 'Atocha Shipwreck', '8 Escudo gold doubloon from the Atocha shipwreck, 1622', 180000, 'USD', 'Mel Fisher Certified', 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=400&fit=crop', ARRAY['collector', 'explorer'], true, 95),
((SELECT id FROM categories WHERE slug = 'shipwreck'), 'Pieces of Eight', 'Atocha Collection', 'Silver pieces of eight from the Atocha shipwreck', 25000, 'USD', 'Mel Fisher Certified', 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=400&fit=crop', ARRAY['collector', 'explorer'], true, 85),

-- Graded sets
((SELECT id FROM categories WHERE slug = 'graded-sets'), 'Morgan Dollar Set', 'MS65 Collection', 'Complete set of Morgan Silver Dollars, MS65 grade', 150000, 'USD', 'PCGS Certified', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop', ARRAY['collector'], true, 88),
((SELECT id FROM categories WHERE slug = 'graded-sets'), 'Walking Liberty Set', 'MS66 Collection', 'Walking Liberty Half Dollar set, MS66 grade', 75000, 'USD', 'NGC Certified', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop', ARRAY['collector'], true, 82),

-- Bundles
((SELECT id FROM categories WHERE slug = 'bundles'), 'Starter Gold Bundle', '1oz + 1/2oz + 1/4oz', 'Perfect starter bundle with 1oz, 1/2oz, and 1/4oz gold coins', 450000, 'USD', 'Mixed Mints', 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=400&fit=crop', ARRAY['tangible_asset_buyer', 'explorer'], true, 80),
((SELECT id FROM categories WHERE slug = 'bundles'), 'Silver Variety Pack', '10 Different Coins', 'Variety pack with 10 different silver coins from various mints', 50000, 'USD', 'Mixed Mints', 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=400&fit=crop', ARRAY['tangible_asset_buyer', 'explorer'], true, 75);

-- Create indexes for performance
CREATE INDEX idx_categories_persona_tags ON categories USING GIN (persona_tags);
CREATE INDEX idx_categories_active ON categories (is_active, sort_weight);
CREATE INDEX idx_items_category_published ON items (category_id, is_published);
CREATE INDEX idx_items_persona_tags ON items USING GIN (persona_tags);
CREATE INDEX idx_items_featured ON items (featured_score DESC, is_published);
CREATE INDEX idx_item_images_item_sort ON item_images (item_id, sort_order);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_items_updated_at BEFORE UPDATE ON items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE item_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_metal_prices ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Categories are viewable by everyone" ON categories FOR SELECT USING (is_active = true);
CREATE POLICY "Items are viewable by everyone" ON items FOR SELECT USING (is_published = true);
CREATE POLICY "Item images are viewable by everyone" ON item_images FOR SELECT USING (true);
CREATE POLICY "Live prices are viewable by everyone" ON live_metal_prices FOR SELECT USING (true);

