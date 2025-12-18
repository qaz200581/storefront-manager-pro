// src/components/dashboard/share/useProductFetcher.ts
import { useState, useEffect, useMemo, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Product } from "@/components/dashboard/share/types";

const LOCAL_CACHE_KEY = 'all_products_cache';
const VERSION_CACHE_KEY = 'products_version_ts';

export function useProductFetcher(isOpen: boolean) {
  const [isLoading, setLoading] = useState(false);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');

  const fetchAllProductsWithCacheValidation = useCallback(async () => {
    setLoading(true);

    // Check local cache first
    const cachedProducts = localStorage.getItem(LOCAL_CACHE_KEY);
    const cachedTimestamp = localStorage.getItem(VERSION_CACHE_KEY);
    const now = Date.now();
    const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

    // Use cache if valid
    if (cachedProducts && cachedTimestamp && (now - parseInt(cachedTimestamp)) < CACHE_TTL) {
      setAllProducts(JSON.parse(cachedProducts) as Product[]);
      setLoading(false);
      return;
    }

    // Fetch fresh data
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .neq('status', '停產')
      .order('name');

    if (error) {
      toast.error('無法載入產品列表');
      setLoading(false);
      return;
    }

    const products = (data as unknown) as Product[];

    localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(products));
    localStorage.setItem(VERSION_CACHE_KEY, String(now));

    setAllProducts(products);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (isOpen && allProducts.length === 0) {
      fetchAllProductsWithCacheValidation();
    }
  }, [isOpen, allProducts.length, fetchAllProductsWithCacheValidation]);

  const filteredProducts = useMemo(() => {
    if (!search) return allProducts;
    const s = search.toLowerCase();
    return allProducts.filter(p =>
      p.name.toLowerCase().includes(s) ||
      p.brand?.toLowerCase().includes(s) ||
      p.model?.toLowerCase().includes(s)
    );
  }, [allProducts, search]);

  return {
    isLoading,
    products: filteredProducts,
    allProducts,
    search,
    setSearch,
  };
}
