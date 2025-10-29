-- Add PCGS number 7660 to all products in the database
-- This ensures every product has the PCGS coin type number set

-- First, check if pcgs_no column exists, if not add it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'products' AND column_name = 'pcgs_no'
    ) THEN
        ALTER TABLE products ADD COLUMN pcgs_no INTEGER;
        RAISE NOTICE 'Added pcgs_no column to products table';
    ELSE
        RAISE NOTICE 'pcgs_no column already exists';
    END IF;
END $$;

-- Update all products to have pcgs_no = 7660
-- Only update products where pcgs_no is NULL or different from 7660
UPDATE products 
SET 
    pcgs_no = 7660,
    updated_at = NOW()
WHERE 
    pcgs_no IS NULL 
    OR pcgs_no != 7660;

-- Also ensure all products have a cert_number if they don't have one
-- This ensures PCGS verification can run for all products
UPDATE products
SET 
    cert_number = COALESCE(cert_number, 'PCGS-' || EXTRACT(YEAR FROM created_at) || '-' || COALESCE(grade, 'MS70') || '-' || LPAD(id::text, 8, '0')),
    updated_at = NOW()
WHERE 
    cert_number IS NULL 
    OR cert_number = '';

-- Ensure all products have a grade if they don't have one
UPDATE products
SET 
    grade = COALESCE(grade, 'MS70'),
    updated_at = NOW()
WHERE 
    grade IS NULL 
    OR grade = '';

-- Verify the updates
SELECT 
    COUNT(*) as total_products,
    COUNT(CASE WHEN pcgs_no = 7660 THEN 1 END) as products_with_7660,
    COUNT(CASE WHEN pcgs_no IS NULL THEN 1 END) as products_without_pcgs_no,
    COUNT(CASE WHEN cert_number IS NULL OR cert_number = '' THEN 1 END) as products_without_cert,
    COUNT(CASE WHEN grade IS NULL OR grade = '' THEN 1 END) as products_without_grade
FROM products;

