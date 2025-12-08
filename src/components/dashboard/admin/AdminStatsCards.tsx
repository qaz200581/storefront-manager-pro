import { Card, CardContent } from '@/components/ui/card';
import { Package, ShoppingCart, DollarSign, Clock } from 'lucide-react';
import { Stats } from './types';

interface AdminStatsCardsProps {
  stats: Stats;
}

export default function AdminStatsCards({ stats }: AdminStatsCardsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card className="animate-fade-in">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Package className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.totalProducts}</p>
              <p className="text-xs text-muted-foreground">總產品數</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-accent-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.totalOrders}</p>
              <p className="text-xs text-muted-foreground">總訂單數</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">總營收</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.pendingOrders}</p>
              <p className="text-xs text-muted-foreground">待處理訂單</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
