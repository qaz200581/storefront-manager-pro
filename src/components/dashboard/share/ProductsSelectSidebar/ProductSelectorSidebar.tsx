import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { toast } from 'sonner';
import { ProductSearchFilters } from './ProductSelect/ProductSearchFilters';
import { Grid, List } from 'lucide-react';
import { ProductGridView } from "./ProductSelect/ProductGridView";
import { ProductTableView } from "./ProductSelect/ProductTableView/ProductTableView";
import { ViewMode, Product } from '../types';
import { useProductFetcher } from '@/components/dashboard/share/useProductFetcher';


interface ProductSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (item: Product, quantity: number) => void;
}

export default function ProductSelectorSidebar({ isOpen, onClose, onSelectProduct }: ProductSelectorProps) {
  const {
    products: fetchedProducts,
    isLoading: loading,
    search,
    setSearch,
  } = useProductFetcher(isOpen);

  // 顯示模式
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  // 篩選狀態
  const [quickSearch, setQuickSearch] = useState("");

  const [selectedbrands, setSelectedbrands] = useState<string[]>([]);
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [selectedSeries, setSelectedSeries] = useState<string[]>([]);
  const [selectedcolors, setSelectedcolors] = useState<string[]>([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  useEffect(() => {
    setSearch(quickSearch);
  }, [quickSearch, setSearch]);
  
  const products = useMemo(() => {
    return fetchedProducts.filter(p => {
      if (selectedbrands.length && !selectedbrands.includes(p.brand)) return false;
      if (selectedModels.length && !selectedModels.includes(p.model)) return false;
      if (selectedSeries.length && !selectedSeries.includes(p.series)) return false;
      if (selectedcolors.length && !selectedcolors.includes(p.color)) return false;
      return true;
    });
  }, [
    fetchedProducts,
    selectedbrands,
    selectedModels,
    selectedSeries,
    selectedcolors,
  ]);

  // 清除所有篩選
  const clearAllFilters = useCallback(() => {
    setQuickSearch("");
    setSelectedbrands([]);
    setSelectedModels([]);
    setSelectedSeries([]);
    setSelectedcolors([]);
  }, []);

  // 處理產品選擇
  const handleSelect = useCallback(
    (product: Product, qty: number = 1) => {
      onSelectProduct(product, qty);
    },
    [onSelectProduct]
  );

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="sm:max-w-md p-0">
        <SheetHeader className="p-4 border-b">
          <SheetTitle>選擇產品</SheetTitle>
          <SheetDescription>請在列表中選擇要添加到訂單的產品。</SheetDescription>
        </SheetHeader>

        <ProductSearchFilters
          quickSearch={quickSearch}
          setQuickSearch={setQuickSearch}
          showAdvancedFilters={showAdvancedFilters}
          setShowAdvancedFilters={setShowAdvancedFilters}
          selectedbrands={selectedbrands}
          setSelectedbrands={setSelectedbrands}
          selectedModels={selectedModels}
          setSelectedModels={setSelectedModels}
          selectedSeries={selectedSeries}
          setSelectedSeries={setSelectedSeries}
          selectedcolors={selectedcolors}
          setSelectedcolors={setSelectedcolors}
          uniquebrands={[...new Set(products.map(p => p.brand || ''))].filter(Boolean)}
          uniqueModels={[...new Set(products.map(p => p.model || ''))].filter(Boolean)}
          uniqueSeries={[...new Set(products.map(p => p.series || ''))].filter(Boolean)}
          uniquecolors={[...new Set(products.map(p => p.color || ''))].filter(Boolean)}
          clearAllFilters={clearAllFilters}
          isLoading={loading}
        />

        {/* 搜尋與視圖切換 */}
        <div className="p-4 flex items-center justify-between mb-4">
          <div className="flex gap-1 border rounded-md w-fit">
            <div
              role="button"
              onClick={() => setViewMode("grid")}
              className={`px-3 py-2 rounded-md cursor-pointer ${viewMode === "grid" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
            >
              <Grid className="w-4 h-4" />
            </div>
            <div
              role="button"
              onClick={() => setViewMode("table")}
              className={`px-3 py-2 rounded-md cursor-pointer ${viewMode === "table" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
            >
              <List className="w-4 h-4" />
            </div>
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-140px)] px-4 pb-4">
          {loading ? (
            <div className="text-center text-sm text-gray-500">載入中...</div>
          ) : products.length === 0 ? (
            <div className="text-center text-sm text-gray-500">未找到產品。</div>
          ) : viewMode === "grid" ? (
            <ProductGridView products={products} onSelectProduct={(p) => handleSelect(p, 1)} />
          ) : (
            <ProductTableView products={products} onSelectProduct={handleSelect} />
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
