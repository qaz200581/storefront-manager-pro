import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Trash2, Plus } from 'lucide-react';
import ProductSelectorSidebar from '@/components/dashboard/share/ProductsSelectSidebar/ProductSelectorSidebar';
import { Product } from '@/components/dashboard/share/types';
import FormProductsList from '@/components/dashboard/share/FormProductsList/FormProductsList';

const STORAGE_KEY = 'order-draft-';

interface OrderItem {
  name: string;
  qty: number;
  price: number;
}

interface FormData {
  customer_name: string;
  items: OrderItem[];
  note: string;
}

interface Props {
  docId: string;
  type: 'sales' | 'purchase';
  onClose: () => void;
  onSubmitSuccess?: () => void;
}

export default function OrderForm({ docId, type, onClose, onSubmitSuccess }: Props) {
  const [formData, setFormData] = useState<FormData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + docId);
    return saved ? JSON.parse(saved) : {
      customer_name: '',
      items: [{ name: '', qty: 1, price: 0 }],
      note: '',
    };
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const title = type === 'sales' ? '銷售單' : '訂單';

  // 自動儲存草稿
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY + docId, JSON.stringify(formData));
    }, 1000);
    return () => clearTimeout(timer);
  }, [formData, docId]);

  const handleClose = () => {
    localStorage.removeItem(STORAGE_KEY + docId);
    onClose();
  };

  const handleSubmit = async () => {
    if (!formData.customer_name.trim()) {
      toast.error('請輸入客戶名稱');
      return;
    }

    if (formData.items.length === 0 || formData.items.every(i => !i.name.trim())) {
      toast.error('請至少新增一個品項');
      return;
    }

    // TODO: 實際寫入 Supabase
    localStorage.removeItem(STORAGE_KEY + docId);
    toast.success(`${title}已成功建立！`);
    onSubmitSuccess?.();
  };

  const openSidebar = () => { // <--- 新增函數
    setIsSidebarOpen(true);
  };

  // 舊的 addItem 函數現在由側邊欄選中產品後觸發
  const handleSelectProduct = (productId: string, quantity: number) => {
    // 從 fetchedProducts 找完整產品資料
    const product = fetchedProducts.find(p => p.id === productId);

    if (!product) {
      toast.error('找不到產品資料');
      return;
    }

    setFormData(prev => ({
      ...prev,
      items: [
        ...prev.items,
        {
          name: product.name,
          qty: quantity,
          price: product.price ?? 0,
        },
      ],
    }));

    toast.info(`已添加 ${product.name} 到訂單`);
  };


  // 移除舊的 addItem 函數

  const removeItem = (idx: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== idx)
    }));
  };

  const updateItem = (idx: number, field: keyof OrderItem, value: string | number) => {
    setFormData(prev => {
      const newItems = [...prev.items];
      newItems[idx] = { ...newItems[idx], [field]: value };
      return { ...prev, items: newItems };
    });
  };

  const total = formData.items.reduce((sum, i) => sum + i.qty * i.price, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">新增{title}</h2>
        <Button variant="ghost" onClick={handleClose}>關閉</Button>
      </div>

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
      {/* 渲染側邊欄組件 */}
      <ProductSelectorSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onSelectProduct={handleSelectProduct}
      />
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <Label>品項</Label>
          <Button size="sm" onClick={openSidebar}>
            <Plus className="w-4 h-4 mr-1" />
            新增品項
          </Button>
        </div>

        {formData.items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <div className="grid grid-cols-3 gap-3 flex-1">
              <Input
                placeholder="品名"
                value={item.name}
                onChange={e => updateItem(idx, 'name', e.target.value)}
              />
              <Input
                type="number"
                placeholder="數量"
                min={1}
                value={item.qty}
                onChange={e => updateItem(idx, 'qty', Number(e.target.value) || 0)}
              />
              <Input
                type="number"
                placeholder="單價"
                min={0}
                value={item.price}
                onChange={e => updateItem(idx, 'price', Number(e.target.value) || 0)}
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeItem(idx)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}

        {formData.items.length > 0 && (
          <div className="text-right text-lg font-semibold text-primary">
            總計: ${total.toLocaleString()}
          </div>
        )}
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
      <FormProductsList products={[]} onSelectProduct={handleSelectProduct} />

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={handleClose}>
          取消
        </Button>
        <Button onClick={handleSubmit}>
          儲存{title}
        </Button>
      </div>
    </div>
  );
}
