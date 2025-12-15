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

    const { data: versionData } = await supabase
      .from("app_metadata")
      .select("last_updated_at")
      .eq('key', 'products_version')
      .single();

    const remoteTimestamp = versionData?.last_updated_at;
    const localTimestamp = localStorage.getItem(VERSION_CACHE_KEY);

    let products: Product[] = [];

    if (!localTimestamp || (remoteTimestamp && remoteTimestamp > localTimestamp)) {
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

      products = data as Product[];
      localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(products));
      if (remoteTimestamp) {
        localStorage.setItem(VERSION_CACHE_KEY, remoteTimestamp);
      }
    } else {
      const cached = localStorage.getItem(LOCAL_CACHE_KEY);
      products = cached ? JSON.parse(cached) : [];
    }

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
