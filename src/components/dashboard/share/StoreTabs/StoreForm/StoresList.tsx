import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Building2, Edit, Users } from 'lucide-react';
import { StoreWithRole } from '../types';
import { useUserRole } from '@/hooks/useUserRole';

interface StoresListProps {
  stores: StoreWithRole[];
  onEdit: (store: StoreWithRole) => void;
  onManageUsers: (store: StoreWithRole) => void;
  isLoading?: boolean;
  isAdmin: boolean;
}

export default function StoresList({ stores, onEdit, onManageUsers, isLoading, isAdmin }: StoresListProps) {
  const { isManager, getStoreRole } = useUserRole();
  
  // 權限檢查：是否可以編輯店家
  const canEditStore = (store: StoreWithRole) => {
    if (isAdmin) return true;
    if (isManager && store.user_role) return true;
    if (store.user_role === 'store_manager') return true;
    return false;
  };
  
  // 權限檢查：是否可以管理用戶
  const canManageUsers = (store: StoreWithRole) => {
    if (isAdmin) return true;
    if (isManager && store.user_role) return true;
    if (store.user_role === 'store_manager') return true;
    return false;
  };
  const getParentName = (parentId: string | null) => {
    if (!parentId) return '-';
    const parent = stores.find(s => s.id === parentId);
    return parent?.name || '-';
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          載入中...
        </CardContent>
      </Card>
    );
  }

  if (stores.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          <Building2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>尚無店家資料</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>店家列表</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>店家名稱</TableHead>
              <TableHead>上層店家</TableHead>
              <TableHead>電話</TableHead>
              <TableHead>地址</TableHead>
              <TableHead>狀態</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stores.map((store) => (
              <TableRow key={store.id}>
                <TableCell className="font-medium">{store.name}</TableCell>
                <TableCell>{getParentName(store.parent_store_id)}</TableCell>
                <TableCell>{store.phone || '-'}</TableCell>
                <TableCell>{store.address || '-'}</TableCell>
                <TableCell>
                  <Badge variant={store.status === '啟用' ? 'default' : 'secondary'}>
                    {store.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    {canEditStore(store) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(store)}
                        title="編輯店家"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    )}
                    {canManageUsers(store) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onManageUsers(store)}
                        title="管理用戶"
                      >
                        <Users className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
