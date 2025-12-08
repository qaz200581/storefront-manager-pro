export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  unit: string;
  stock: number;
  image_url: string | null;
  is_active: boolean;
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
  unit: string;
  stock: string;
}
