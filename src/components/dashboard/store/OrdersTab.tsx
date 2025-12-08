import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Order } from './types';

interface OrdersTabProps {
  orders: Order[];
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'pending':
      return <Badge variant="outline" className="bg-warning/10 text-warning border-warning">待處理</Badge>;
    case 'confirmed':
      return <Badge variant="outline" className="bg-primary/10 text-primary border-primary">已確認</Badge>;
    case 'completed':
      return <Badge variant="outline" className="bg-success/10 text-success border-success">已完成</Badge>;
    case 'cancelled':
      return <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive">已取消</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export default function OrdersTab({ orders }: OrdersTabProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">訂單記錄</h2>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>訂單編號</TableHead>
                <TableHead>金額</TableHead>
                <TableHead>狀態</TableHead>
                <TableHead>下單時間</TableHead>
                <TableHead>備註</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    尚無訂單記錄
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-sm">
                      {order.id.slice(0, 8)}...
                    </TableCell>
                    <TableCell className="font-medium">
                      ${Number(order.total_amount).toLocaleString()}
                    </TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString('zh-TW', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                      {order.notes || '-'}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
