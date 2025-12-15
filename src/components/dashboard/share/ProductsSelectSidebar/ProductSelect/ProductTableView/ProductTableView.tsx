// ProductTableView.tsx
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Product } from "../../../types";
import { ProductTableButton } from "./ProductTableButton";
import { ProductTableInput } from "./ProductTableInput";


interface ProductTableViewProps {
  products: Product[];
  onSelectProduct: (product: Product, quantity: number) => void;
}

interface TableProductMapping {
  product: Product;
  settingIndex: number;
  tableTitle: string;
  tableRowTitle: string;
  tableColTitle: string;
}

interface GroupedByTable {
  tableTitle: string;
  rows: string[];
  cols: string[];
  mappings: TableProductMapping[];
}

export const ProductTableView = ({ products, onSelectProduct }: ProductTableViewProps) => {
  const [showAsButton, setShowAsButton] = useState(true);
  const [editableData, setEditableData] = useState<Record<string, string>>({});

  // 重構：將產品按 table_settings 展開並分組
  const groupedTables = useMemo(() => {
    const tableMap: Record<string, GroupedByTable> = {};

    products.forEach((product) => {
      const settings = product.table_settings || [];
      
      settings.forEach((setting, index) => {
        const { table_title, table_row_title, table_col_title } = setting;
        
        if (!table_title) return;

        if (!tableMap[table_title]) {
          tableMap[table_title] = {
            tableTitle: table_title,
            rows: [],
            cols: [],
            mappings: [],
          };
        }

        tableMap[table_title].mappings.push({
          product,
          settingIndex: index,
          tableTitle: table_title,
          tableRowTitle: table_row_title || "",
          tableColTitle: table_col_title || "",
        });

        if (table_row_title && !tableMap[table_title].rows.includes(table_row_title)) {
          tableMap[table_title].rows.push(table_row_title);
        }
        if (table_col_title && !tableMap[table_title].cols.includes(table_col_title)) {
          tableMap[table_title].cols.push(table_col_title);
        }
      });
    });

    return Object.values(tableMap);
  }, [products]);

  const handleButtonClick = (product: Product) => onSelectProduct(product, 1);

  const submitToList = () => {
    let count = 0;
    Object.entries(editableData).forEach(([id, value]) => {
      const qty = parseInt(value);
      if (value && !isNaN(qty) && qty > 0) {
        // 修正：使用 foundProduct 避免變數名稱衝突
        const foundProduct = products.find((p) => p.id === (id));
        if (foundProduct) {
          onSelectProduct(foundProduct, qty);
          count++;
        }
      }
    });
    count > 0 ? toast.success(`已批量添加 ${count} 項產品`) : toast.error("請先輸入產品數量");
    setEditableData({});
  };

  return (
    <div className="space-y-4">
      {/* 模式切換 */}
      <div className="flex items-center justify-between sticky top-0 bg-background z-20 py-3 px-4 border-b shadow-sm">
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={showAsButton}
            onChange={(e) => setShowAsButton(e.target.checked)}
            className="sr-only peer"
          />
          <div className="relative w-14 h-7 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
          <span className="ms-3 text-sm font-medium">{showAsButton ? "切換輸入" : "切換按鈕"}</span>
        </label>
        {!showAsButton && (
          <Button onClick={submitToList} size="sm">
            確認
          </Button>
        )}
      </div>

      {/* 渲染每個表格 */}
      {groupedTables.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          沒有配置表格式下單的產品
        </div>
      ) : (
        groupedTables.map((table) => {
          const { tableTitle, rows, cols, mappings } = table;

          return (
            <div key={tableTitle} className="mb-8">
              <h3 className="text-lg font-semibold mb-2">{tableTitle}</h3>
              <div className="overflow-x-auto border rounded-lg">
                {showAsButton ? (
                  <ProductTableButton
                    tableTitle={tableTitle}
                    rows={rows}
                    cols={cols}
                    mappings={mappings}
                    onSelectProduct={handleButtonClick}
                  />
                ) : (
                  <ProductTableInput
                    tableTitle={tableTitle}
                    rows={rows}
                    cols={cols}
                    mappings={mappings}
                    editableData={editableData}
                    setEditableData={setEditableData}
                  />
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};
