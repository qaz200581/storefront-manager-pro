export interface Product {
  id: string;
  name: string;
  brand?: string | null;
  series?: string | null;
  model?: string | null;
  color?: string | null;
  description: string | null;
  price: number;
  retail_price: number | null;
  dealer_price: number | null;
  unit: string;
  stock: number;
  image_url: string | null;
  is_active: boolean;
  status: '上架中' | '已下架' | '預購中' | '售完';
  category: string | null;
  parent_product_id: string | null;
  table_title: string | null;
  table_row_title: string | null;
  table_col_title: string | null;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  status: string;
  total_amount: number;
  notes: string | null;
  created_at: string;
  profiles?: {
    store_name: string | null;
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
  parent_product_id: string;
  table_title: string;
  table_row_title: string;
  table_col_title: string;
}
