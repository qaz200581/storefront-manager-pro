import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, ArrowLeft, UserPlus, Users } from 'lucide-react';
import { Store, StoreUser, StoreRole } from '../types';

interface StoreUsersListProps {
  store: Store;
  users: StoreUser[];
  onBack: () => void;
  onAddUser: () => void;
  onEditUser: (user: StoreUser) => void;
  isLoading?: boolean;
}

const roleLabels: Record<StoreRole, string> = {
  owner: '店長',
  manager: '經理',
  employee: '員工',
};

export default function StoreUsersList({ 
  store, 
  users, 
  onBack, 
  onAddUser, 
  onEditUser, 
  isLoading 
}: StoreUsersListProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          載入中...
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <CardTitle>{store.name} - 用戶管理</CardTitle>
          </div>
          <Button onClick={onAddUser} size="sm">
            <UserPlus className="w-4 h-4 mr-2" />
            新增用戶
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {users.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>此店家尚無用戶</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>名稱</TableHead>
                <TableHead>角色</TableHead>
                <TableHead>狀態</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.profile?.email || '-'}</TableCell>
                  <TableCell>{user.profile?.store_name || '-'}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {roleLabels[user.role]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.status === '啟用' ? 'default' : 'secondary'}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditUser(user)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
