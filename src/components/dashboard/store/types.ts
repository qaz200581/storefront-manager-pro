export interface TableSetting {
  id: string;
  table_title: string;
  table_row_title: string;
  table_col_title: string;
}
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
  barcode?: string | null;
  stock: number;
  image_url: string | null;
  status: '上架中' |'售完停產' | '預購中' | '停產';
  category: string | null;
  parent_product_id: string | null;
  table_settings?:TableSetting[];
  created_at: string;
  updated_at: string;
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
  user_name: string | null;
}
