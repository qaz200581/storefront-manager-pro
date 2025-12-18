import { Product, TableSetting } from '@/components/dashboard/share/types';

// Re-export Product for backward compatibility
export type { Product } from '@/components/dashboard/share/types';

export interface Order {
  id: string;
  user_id: string;
  status: string;
  total_amount: number;
  notes: string | null;
  created_at: string;
  profiles?: {
    user_name: string | null;
    email: string;
  };
}

export interface Stats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
}

export interface ProductFormData {
  name: string;
  brand: string;
  series: string;
  model: string;
  color: string;
  description: string;
  price: string;
  retail_price: string;
  dealer_price: string;
  unit: string;
  stock: string;
  category: string;
  barcode: string;
  parent_product_id: string;
  table_settings?: TableSetting[] | null;
}
