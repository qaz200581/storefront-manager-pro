export type ViewMode = "grid" | "table";

export interface Product {
  id: string;
  name: string;
  brand?: string | null;
  series?: string | null;
  model?: string | null;
  color?: string | null;
  description: string | null;
  price: number;
  retail_price?: number | null;
  barcode?: string | null;
  dealer_price?: number | null;
  unit: string;
  stock: number;
  image_url: string | null;
  status: '上架中' |'售完停產' | '預購中' | '停產';
  category: string | null;
  parent_product_id: string | null;
  table_settings?: {
    id: string;
    table_title: string;
    table_row_title: string;
    table_col_title: string;
  }[] | null;
  created_at: string;
  updated_at: string;
}
