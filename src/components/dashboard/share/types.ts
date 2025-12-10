export type ViewMode = "grid" | "table";
export interface Product {
  id: number;                // 唯一 ID
  code?: string;              // 產品代碼
  name: string;              // 產品名稱
  brand?: string;           // 廠商
  model?: string;            // 型號
  series?: string;           // 系列
  color?: string;           // 備註
  priceDistribution?: number; // 價格
  tableTitle?: string;       // table 顯示標題（可多值）
  tableRowTitle?: string;    // table 列標題（可多值）
  tableColTitle?: string;    // table 欄標題（可多值）
}
