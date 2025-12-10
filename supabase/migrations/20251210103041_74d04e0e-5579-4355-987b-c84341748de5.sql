-- 新增 status 欄位到 products 表
ALTER TABLE public.products 
ADD COLUMN status text NOT NULL DEFAULT '上架中';

-- 根據現有 is_active 欄位設定 status 值
UPDATE public.products 
SET status = CASE 
  WHEN is_active = true THEN '上架中'
  ELSE '已下架'
END;

-- 建立索引
CREATE INDEX idx_products_status ON public.products(status);