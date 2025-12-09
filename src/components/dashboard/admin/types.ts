export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  retail_price: number | null;
  dealer_price: number | null;
  unit: string;
  stock: number;
  image_url: string | null;
  is_active: boolean;
  category: string | null;
  parent_product_id: string | null;
  table_settings?: {
    id: string;
    table_title: string;
    table_row_title: string;
    table_col_title: string;
  }[] | null;

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
  description: string;
  price: string;
  retail_price: string;
  dealer_price: string;
  unit: string;
  stock: string;
  category: string;
  parent_product_id: string;
  table_settings?: {
    id: string;
    table_title: string;
    table_row_title: string;
    table_col_title: string;
  }[];
}
