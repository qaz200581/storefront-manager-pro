import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Package, ShoppingCart, History } from 'lucide-react';

import StoreHeader from './StoreHeader';
import ProductsTab from './ProductsTab';
import CartTab from './CartTab';
import OrdersTab from './OrdersTab';
import { Product, CartItem, Order, Profile } from './types';

export default function StoreDashboard() {
  const { signOut, user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderNotes, setOrderNotes] = useState('');
  const [profile, setProfile] = useState<Profile>({ store_name: null });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchOrders();
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('profiles')
      .select('store_name')
      .eq('id', user.id)
      .maybeSingle();

    if (data) {
      setProfile(data);
    }
  };

  const fetchProducts = async () => {
    console.log("載入產品中...")
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      toast.error('無法載入產品');
      return;
    }

    setProducts(data || []);
  };

  const fetchOrders = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('無法載入訂單');
      return;
    }

    setOrders(data || []);
  };

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    toast.success(`已加入 ${product.name}`);
  };

  const updateCartQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const handleSubmitOrder = async () => {
    if (cart.length === 0) {
      toast.error('購物車是空的');
      return;
    }

    if (!user) {
      toast.error('請先登入');
      return;
    }

    setIsSubmitting(true);

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        total_amount: cartTotal,
        notes: orderNotes.trim() || null,
        status: 'pending',
      })
      .select()
      .single();

    if (orderError) {
      toast.error('建立訂單失敗');
      setIsSubmitting(false);
      return;
    }

    const orderItems = cart.map((item) => ({
      order_id: order.id,
      product_id: item.product.id,
      product_name: item.product.name,
      quantity: item.quantity,
      unit_price: item.product.price,
      subtotal: item.product.price * item.quantity,
    }));

    const { error: itemsError } = await supabase.from('order_items').insert(orderItems);

    if (itemsError) {
      toast.error('建立訂單項目失敗');
      setIsSubmitting(false);
      return;
    }

    toast.success('訂單已送出！');
    setCart([]);
    setOrderNotes('');
    setIsSubmitting(false);
    fetchOrders();
  };

  return (
    <div className="min-h-screen bg-background">
      <StoreHeader storeName={profile.store_name} onSignOut={signOut} />

      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="products" className="space-y-4">
          <TabsList className="w-full md:w-auto">
            <TabsTrigger value="products" className="flex-1 md:flex-none">
              <Package className="w-4 h-4 mr-2" />
              產品目錄
            </TabsTrigger>
            <TabsTrigger value="cart" className="flex-1 md:flex-none relative">
              <ShoppingCart className="w-4 h-4 mr-2" />
              購物車
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex-1 md:flex-none">
              <History className="w-4 h-4 mr-2" />
              訂單記錄
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <ProductsTab products={products} onAddToCart={addToCart} />
          </TabsContent>

          <TabsContent value="cart">
            <CartTab
              cart={cart}
              cartTotal={cartTotal}
              orderNotes={orderNotes}
              isSubmitting={isSubmitting}
              onUpdateQuantity={updateCartQuantity}
              onRemoveItem={removeFromCart}
              onNotesChange={setOrderNotes}
              onSubmitOrder={handleSubmitOrder}
            />
          </TabsContent>

          <TabsContent value="orders">
            <OrdersTab orders={orders} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
