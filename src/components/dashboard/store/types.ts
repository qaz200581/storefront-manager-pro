export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  unit: string;
  stock: number;
  image_url: string | null;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  status: string;
  total_amount: number;
  notes: string | null;
  created_at: string;
}

export interface Profile {
  store_name: string | null;
}
