import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button'; // 保留 Button 以用於選擇
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'; // 引入 Sheet 組件
import { toast } from 'sonner';
import { ProductSearchFilters } from './ProductSelect/ProductSearchFilters';
import { Grid, List } from 'lucide-react';
interface Product {
  id: string;
  name: string;
  price: number;
  status: string; // 簡化為 string，但應使用 Supabase Enum 類型
  // 其他您需要的產品屬性
}

interface ProductSelectorProps {
  isOpen: boolean;
  onClose: () => void; // 這裡的 onClose 將直接傳遞給 Sheet 的 onOpenChange
  onSelectProduct: (item: { name: string; price: number }) => void;
}

export default function ProductSelectorSidebar({ isOpen, onClose, onSelectProduct }: ProductSelectorProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  // 💡 新增狀態：產品列表的顯示模式
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  // 產品搜索和載入邏輯 (與您原來的邏輯相同)
  useEffect(() => {
    if (!isOpen) return;

    const fetchProducts = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from('products')
        .select('id, name, price, status')
        .neq('status', '停產') // 載入非停產產品
        .ilike('name', `%${search}%`)
        .order('name');

      if (error) {
        toast.error('無法載入產品列表');
        console.error(error);
        setProducts([]);
      } else {
        setProducts(data as Product[] || []);
      }
      setLoading(false);
    };

    const timer = setTimeout(() => fetchProducts(), 300);
    return () => clearTimeout(timer);
  }, [search, isOpen]); // 當側邊欄開啟或搜索詞變更時觸發

  // 處理選擇產品
  const handleSelect = (product: Product) => {
    onSelectProduct({
      name: product.name,
      price: product.price,
    });
    onClose(); // 選擇後關閉
  };

  return (
    // 使用 Sheet 元件包裝側邊欄
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="sm:max-w-md p-0">
        <SheetHeader className="p-4 border-b">
          <SheetTitle>選擇產品</SheetTitle>
          <SheetDescription>
            請在列表中選擇要添加到訂單的產品。
          </SheetDescription>
        </SheetHeader>
        <ProductSearchFilters quickSearch={''} setQuickSearch={function (value: string): void {
          throw new Error('Function not implemented.');
        }} showAdvancedFilters={false} setShowAdvancedFilters={function (value: boolean): void {
          throw new Error('Function not implemented.');
        }} selectedvenders={[]} setSelectedvenders={function (value: string[]): void {
          throw new Error('Function not implemented.');
        }} selectedModels={[]} setSelectedModels={function (value: string[]): void {
          throw new Error('Function not implemented.');
        }} selectedSeries={[]} setSelectedSeries={function (value: string[]): void {
          throw new Error('Function not implemented.');
        }} selectedRemarks={[]} setSelectedRemarks={function (value: string[]): void {
          throw new Error('Function not implemented.');
        }} uniquevenders={[]} uniqueModels={[]} uniqueSeries={[]} uniqueRemarks={[]} clearAllFilters={function (): void {
          throw new Error('Function not implemented.');
        }} />
        <div className="p-4">
          <Input
            placeholder="搜索產品名稱..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-4"
          />
        </div>

        {/* 產品列表區域，使用 ScrollArea 保持捲動 */}
        <ScrollArea className="h-[calc(100vh-140px)] px-4 pb-4">
          {loading ? (
            <div className="text-center text-sm text-gray-500">載入中...</div>
          ) : products.length === 0 ? (
            <div className="text-center text-sm text-gray-500">未找到產品。</div>
          ) : (
            <div className="space-y-2">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="p-3 border rounded-md hover:bg-gray-50 cursor-pointer transition-colors flex justify-between items-center"
                  onClick={() => handleSelect(product)}
                >
                  <div>
                    <div className="font-medium">{product.name}</div>
                    <div className="text-xs text-gray-500">狀態: {product.status}</div>
                  </div>
                  <div className="text-sm font-semibold">${product.price.toLocaleString()}</div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        <div className="p-4">
          {/* 頂部控制項：搜索和視圖切換 */}
          <div className="flex items-center justify-between mb-4">
            <Input
              placeholder="搜索產品名稱..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 mr-3"
            />

            {/* 視圖切換按鈕組 */}
            <div className="flex gap-1 border rounded-md w-fit">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="px-3"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "table" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("table")}
                className="px-3"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-140px)] px-4 pb-4">
          {loading ? (
            <div className="text-center text-sm text-gray-500">載入中...</div>
          ) : products.length === 0 ? (
            <div className="text-center text-sm text-gray-500">未找到產品。</div>
          ) : (
            // 🔴 條件渲染：根據 viewMode 渲染不同的列表
            <>
              {viewMode === "grid" && (
                <div className="grid grid-cols-1 gap-2">
                  {/* 網格/卡片式顯示 (保持您原來的樣式) */}
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="p-3 border rounded-md hover:bg-gray-50 cursor-pointer transition-colors flex justify-between items-center"
                      onClick={() => handleSelect(product)}
                    >
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-xs text-gray-500">狀態: {product.status}</div>
                      </div>
                      <div className="text-sm font-semibold">${product.price.toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              )}

              {viewMode === "table" && (
                <div className="space-y-1">
                  {/* 列表/表格簡約顯示 */}
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="py-2 px-3 border-b hover:bg-gray-50 cursor-pointer flex justify-between items-center text-sm"
                      onClick={() => handleSelect(product)}
                    >
                      <span className="flex-1 truncate">{product.name}</span>
                      <span className="w-20 text-right font-medium">${product.price.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
