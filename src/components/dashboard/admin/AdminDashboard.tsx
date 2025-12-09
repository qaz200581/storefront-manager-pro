import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Package, ShoppingCart } from 'lucide-react';

import AdminHeader from './AdminHeader';
import AdminStatsCards from './AdminStatsCards';
import ProductsTab from './ProductsTab/ProductsTab';
import OrdersTab from './OrdersTab';
import { Product, Order, Stats, ProductFormData } from './types';

const initialProductForm: ProductFormData = {
  name: '',
  description: '',
  price: '',
  retail_price: '',
  dealer_price: '',
  unit: '個',
  stock: '',
  category: '',
  parent_product_id: '',
  table_settings: [],
};

export default function AdminDashboard() {
  const { signOut } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
  });
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState<ProductFormData>(initialProductForm);

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('無法載入產品');
      return;
    }

    setProducts(data || []);
    setStats((prev) => ({ ...prev, totalProducts: data?.length || 0 }));
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

  const handleProductSubmit = async () => {
    if (!productForm.name || !productForm.retail_price) {
      toast.error('請填寫產品名稱和零售價');
      return;
    }

    const productData = {
      name: productForm.name.trim(),
      description: productForm.description.trim() || null,
      price: parseFloat(productForm.price) || parseFloat(productForm.retail_price),
      retail_price: parseFloat(productForm.retail_price),
      dealer_price: productForm.dealer_price ? parseFloat(productForm.dealer_price) : null,
      unit: productForm.unit,
      stock: parseInt(productForm.stock) || 0,
      category: productForm.category.trim() || null,
      parent_product_id: productForm.parent_product_id || null,
      table_settings: productForm.table_settings ?? [],

    };

    if (editingProduct) {
      const { error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', editingProduct.id);

      if (error) {
        toast.error('更新產品失敗');
        return;
      }
      toast.success('產品已更新');
    } else {
      const { error } = await supabase.from('products').insert(productData);

      if (error) {
        toast.error('新增產品失敗');
        return;
      }
      toast.success('產品已新增');
    }

    setIsProductDialogOpen(false);
    setEditingProduct(null);
    setProductForm(initialProductForm);
    fetchProducts();
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description || '',
      price: product.price?.toString() || '',
      retail_price: product.retail_price?.toString() || product.price?.toString() || '',
      dealer_price: product.dealer_price?.toString() || '',
      unit: product.unit,
      stock: product.stock.toString(),
      category: product.category || '',
      parent_product_id: product.parent_product_id || '',
      table_settings: product.table_settings ?? [],
    });
    setIsProductDialogOpen(true);
  };

  const handleDeleteProduct = async (id: string) => {
    const { error } = await supabase.from('products').delete().eq('id', id);

    if (error) {
      toast.error('刪除產品失敗');
      return;
    }

    toast.success('產品已刪除');
    fetchProducts();
  };

  const handleToggleProductStatus = async (product: Product) => {
    const { error } = await supabase
      .from('products')
      .update({ is_active: !product.is_active })
      .eq('id', product.id);

    if (error) {
      toast.error('更新狀態失敗');
      return;
    }

    toast.success(product.is_active ? '產品已下架' : '產品已上架');
    fetchProducts();
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

  const handleResetProductForm = () => {
    setEditingProduct(null);
    setProductForm(initialProductForm);
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
              <ShoppingCart className="w-4 h-4 mr-2" />
              訂單管理
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <ProductsTab
              products={products}
              isDialogOpen={isProductDialogOpen}
              setIsDialogOpen={setIsProductDialogOpen}
              editingProduct={editingProduct}
              productForm={productForm}
              setProductForm={setProductForm}
              onResetForm={handleResetProductForm}
              onSubmit={handleProductSubmit}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
              onToggleStatus={handleToggleProductStatus}
            />
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
