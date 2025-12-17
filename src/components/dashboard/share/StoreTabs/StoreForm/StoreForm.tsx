import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Store, StoreFormData } from '../types';

interface StoreFormProps {
  store?: Store | null;
  stores: Store[];
  onSubmit: (data: StoreFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function StoreForm({ store, stores, onSubmit, onCancel, isLoading }: StoreFormProps) {
  const [formData, setFormData] = useState<StoreFormData>({
    name: '',
    parent_store_id: null,
    address: '',
    phone: '',
    status: 'active',
  });

  useEffect(() => {
    if (store) {
      setFormData({
        name: store.name,
        parent_store_id: store.parent_store_id || null,
        address: store.address || '',
        phone: store.phone || '',
        status: store.status,
      });
    }
  }, [store]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  // Filter out the current store from the parent store options
  const parentStoreOptions = stores.filter(s => s.id !== store?.id);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{store ? '編輯店家' : '新增店家'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">店家名稱 *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="請輸入店家名稱"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="parent_store_id">上層店家</Label>
            <Select
              value={formData.parent_store_id || 'none'} // 當 parent_store_id 為 null 時，Select 的值為 'none'
              onValueChange={(value) =>
                setFormData({ ...formData, parent_store_id: value === 'none' ? null : value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="選擇上層店家 (可選)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">無</SelectItem>
                {parentStoreOptions.map((parent) => (
                  <SelectItem key={parent.id} value={parent.id}>
                    {parent.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">地址</Label>
            <Input
              id="address"
              value={formData.address || ''}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="請輸入店家地址"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">電話</Label>
            <Input
              id="phone"
              value={formData.phone || ''}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="請輸入店家電話"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">狀態</Label>
            <Select value={formData.status || "active"} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="active">啟用</SelectItem>
                <SelectItem value="inactive">停用</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? '處理中...' : store ? '更新' : '新增'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              取消
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}