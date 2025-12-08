-- Add new columns to products table
ALTER TABLE public.products 
ADD COLUMN category text,
ADD COLUMN retail_price numeric,
ADD COLUMN dealer_price numeric,
ADD COLUMN parent_product_id uuid REFERENCES public.products(id),
ADD COLUMN table_title text,
ADD COLUMN table_row_title text,
ADD COLUMN table_col_title text;

-- Migrate existing price to retail_price
UPDATE public.products SET retail_price = price WHERE retail_price IS NULL;

-- Add index for parent product lookup
CREATE INDEX idx_products_parent ON public.products(parent_product_id);

-- Add index for category
CREATE INDEX idx_products_category ON public.products(category);