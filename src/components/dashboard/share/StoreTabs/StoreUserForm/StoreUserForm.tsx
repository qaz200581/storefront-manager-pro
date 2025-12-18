import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StoreUser, StoreUserFormData, StoreRole } from '../types';

interface StoreUserFormProps {
  storeUser?: StoreUser | null;
  storeName: string;
  onSubmit: (data: StoreUserFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function StoreUserForm({ storeUser, storeName, onSubmit, onCancel, isLoading }: StoreUserFormProps) {
  const [formData, setFormData] = useState<StoreUserFormData>({
    email: '',
    user_name: '',
    role: 'employee',
    status: '啟用',
  });

  useEffect(() => {
    if (storeUser) {
      setFormData({
        email: storeUser.profile?.email || '',
        user_name: storeUser.profile?.user_name || '',
        role: storeUser.role,
        status: storeUser.status,
      });
    }
  }, [storeUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const roleOptions: { value: StoreRole; label: string }[] = [
    { value: 'owner', label: '店長' },
    { value: 'manager', label: '經理' },
    { value: 'employee', label: '員工' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {storeUser ? '編輯用戶' : '新增用戶'} - {storeName}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="請輸入用戶 Email"
              required
              disabled={!!storeUser} // Disable email editing for existing users
            />
            {!storeUser && (
              <p className="text-sm text-muted-foreground">
                用戶需要已經在系統中註冊
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">角色 *</Label>
            <Select
              value={formData.role || 'employee'}
              onValueChange={(value) => setFormData({ ...formData, role: value as StoreRole })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {roleOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">狀態</Label>
            <Select
              value={formData.status || 'active'}
              onValueChange={(value) => setFormData({ ...formData, status: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">啟用</SelectItem>
                <SelectItem value="inactive">停用</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? '處理中...' : storeUser ? '更新' : '新增'}
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
