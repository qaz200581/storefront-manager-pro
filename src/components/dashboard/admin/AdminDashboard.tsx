import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Settings, Package, ShoppingCart, Clipboard,ClipboardCheck } from 'lucide-react';

import AdminHeader from './AdminHeader';
import AdminStatsCards from './AdminStatsCards';
import ProductsTab from './ProductsTab/ProductsTab';
import OrdersTab from './OrdersTab/OrdersTab';
import { Order, Stats } from './types';

export default function AdminDashboard() {
  const { signOut } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
  });

  useEffect(() => {
    fetchStats();
    fetchOrders();
  }, []);

  const fetchStats = async () => {
    const { count } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });

    setStats((prev) => ({ ...prev, totalProducts: count || 0 }));
  };

  const fetchOrders = async () => {
    const { data: fetchedOrders, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (ordersError) {
      toast.error('無法載入訂單');
      return;
    }

    const userIds = [...new Set(fetchedOrders?.map(o => o.user_id) || [])] as string[];
    const { data: profilesData } = await supabase
      .from('profiles')
      .select('id, store_name, email')
      .in('id', userIds);

    const profilesMap = new Map(profilesData?.map(p => [p.id, p]) || []);

    const ordersWithProfiles = (fetchedOrders || []).map(order => ({
      ...order,
      profiles: profilesMap.get(order.user_id) || { store_name: null, email: '' }
    }));

    setOrders(ordersWithProfiles);

    const totalRevenue = ordersWithProfiles
      .filter((o) => o.status === 'completed')
      .reduce((sum, o) => sum + Number(o.total_amount), 0);
    const pendingOrders = ordersWithProfiles.filter((o) => o.status === 'pending').length;

    setStats((prev) => ({
      ...prev,
      totalOrders: ordersWithProfiles.length,
      totalRevenue,
      pendingOrders,
    }));
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);

    if (error) {
      toast.error('更新訂單狀態失敗');
      return;
    }

    toast.success('訂單狀態已更新');
    fetchOrders();
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader onSignOut={signOut} />

      <main className="container mx-auto px-4 py-6 space-y-6">
        <AdminStatsCards stats={stats} />

        <Tabs defaultValue="products" className="space-y-4">
          <TabsList className="w-full md:w-auto">
            
            <TabsTrigger value="products" className="flex-1 md:flex-none">
              <Package className="w-4 h-4 mr-2" />
              產品管理
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex-1 md:flex-none">
              <Clipboard className="w-4 h-4 mr-2" />

              訂單管理
            </TabsTrigger>
            <TabsTrigger value="sales" className="flex-1 md:flex-none">
              <ClipboardCheck className="w-4 h-4 mr-2" />
              設定管理
            </TabsTrigger>
            <TabsTrigger value="setting" className="flex-1 md:flex-none">
              <Settings className="w-4 h-4 mr-2" />
              設定管理
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <ProductsTab />
          </TabsContent>

          <TabsContent value="orders">
            <OrdersTab
              orders={orders}
              onUpdateStatus={handleUpdateOrderStatus}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
