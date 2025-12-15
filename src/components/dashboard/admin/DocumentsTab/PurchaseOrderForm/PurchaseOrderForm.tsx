// components/admin/DocumentsTab/SalesOrderForm.tsx
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { ProductSelectorSidebar } from '@/components/dashboard/share/ProductsSelectSidebar/ProductSelectorSidebar';
import { Cog,ChevronRight ,Package} from 'lucide-react';
const STORAGE_KEY = 'sales-draft-';

interface Item {
  name: string;
  qty: number;
  price: number;
}

interface FormData {
  customer_name: string;
  items: Item[];
  note: string;
}

interface Props {
  docId: string;
  onClose: () => void;
  onSubmitSuccess?: () => void;
}

export default function SalesOrderForm({ docId, onClose, onSubmitSuccess }: Props) {
  const [formData, setFormData] = useState<FormData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + docId);
    return saved ? JSON.parse(saved) : {
      customer_name: '',
      items: [{ name: '', qty: 1, price: 0 }],
      note: '',
    };
  });

  // 自動儲存草稿（每 1 秒）
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY + docId, JSON.stringify(formData));
    }, 1000);

    return () => clearTimeout(timer);
  }, [formData, docId]);

  // 關閉時自動清除草稿（可選）
  const handleClose = () => {
    localStorage.removeItem(STORAGE_KEY + docId);
    onClose();
  };

  const handleSubmit = async () => {
    // 實際寫入 Supabase
    /*const { error } = await supabase
      .from('sales_orders')
      .insert({
        customer_name: formData.customer_name,
        items: formData.items,
        note: formData.note,
        total_amount: formData.items.reduce((sum, i) => sum + i.qty * i.price, 0),
        status: 'completed',
      });

    if (error) {
      toast.error('儲存失敗：' + error.message);
      return;
    }
      */
    localStorage.removeItem(STORAGE_KEY + docId);
    toast.success('銷售單已成功建立！');
    onSubmitSuccess?.();
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { name: '', qty: 1, price: 0 }]
    }));
  };
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">新增訂單</h2>
        <Button variant="ghost" onClick={handleClose}>關閉</Button>
      </div>
      {/* Sidebar 切換按鈕 */}
      <Button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-20 right-2 md:right-4 z-40 shadow-lg flex flex-col items-center justify-center py-3 px-2 md:px-4 h-auto"
        size="lg"
      >
        <Package className="w-5 h-5 mb-1" />
        <span className="hidden md:inline [writing-mode:vertical-rl] rotate-360 leading-none tracking-tight text-xs">
          產品選擇
        </span>
        <ChevronRight
          className={`w-4 h-4 mt-1 transition-transform ${isSidebarOpen ? "rotate-180" : ""
            }`}
        />
      </Button>

      <ProductSelectorSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        filteredProductsCount={42}
        activeFilterCount={3}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>客戶名稱</Label>
          <Input
            value={formData.customer_name}
            onChange={e => setFormData({ ...formData, customer_name: e.target.value })}
            placeholder="請輸入客戶名稱"
          />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <Label>品項</Label>
          <Button size="sm" onClick={addItem}>+ 新增品項</Button>
        </div>
        {formData.items.map((item, idx) => (
          <div key={idx} className="grid grid-cols-3 gap-3">
            <Input
              placeholder="品名"
              value={item.name}
              onChange={e => {
                const newItems = [...formData.items];
                newItems[idx].name = e.target.value;
                setFormData({ ...formData, items: newItems });
              }}
            />
            <Input
              type="number"
              placeholder="數量"
              value={item.qty}
              onChange={e => {
                const newItems = [...formData.items];
                newItems[idx].qty = Number(e.target.value) || 0;
                setFormData({ ...formData, items: newItems });
              }}
            />
            <Input
              type="number"
              placeholder="單價"
              value={item.price}
              onChange={e => {
                const newItems = [...formData.items];
                newItems[idx].price = Number(e.target.value) || 0;
                setFormData({ ...formData, items: newItems });
              }}
            />
          </div>
        ))}
      </div>

      <div>
        <Label>備註</Label>
        <Textarea
          value={formData.note}
          onChange={e => setFormData({ ...formData, note: e.target.value })}
          placeholder="選填"
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={handleClose}>
          取消
        </Button>
        <Button onClick={handleSubmit}>
          儲存銷售單
        </Button>
      </div>
    </div>
  );
}