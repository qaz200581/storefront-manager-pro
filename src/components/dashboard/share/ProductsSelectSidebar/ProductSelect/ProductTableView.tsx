import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { Product } from "../../types";

interface ProductTableViewProps {
  products: Product[];
  onSelectProduct: (product: Product, quantity: number) => void;
}

interface GroupedProduct {
  product: Product;
  tableTitle: string;
  tableRowTitle?: string;
  tableColTitle?: string;
}

export const ProductTableView = ({ products, onSelectProduct }: ProductTableViewProps) => {
  const [showAsButton, setShowAsButton] = useState(true);
  const [editableData, setEditableData] = useState<Record<string, string>>({});

  const groupedProducts = useMemo(() => {
    const grouped: Record<string, GroupedProduct[]> = {};

    products.forEach((product) => {
      const titles = product.tableTitle?.split(",").map((t) => t.trim()) || [];
      const colTitles = product.tableColTitle?.split(",").map((r) => r.trim()) || [];
      if (!titles.length) return;

      titles.forEach((title, i) => {
        const colTitle = colTitles[i] || "";
        if (!grouped[title]) grouped[title] = [];
        grouped[title].push({ product, tableTitle: title, tableRowTitle: product.tableRowTitle, tableColTitle: colTitle });
      });
    });

    return grouped;
  }, [products]);

  const getUniqueCols = (list: GroupedProduct[]) => [...new Set(list.map((p) => p.tableColTitle))].filter(Boolean);
  const getUniqueRows = (list: GroupedProduct[]) => [...new Set(list.map((p) => p.tableRowTitle))].filter(Boolean);

  const getCellProduct = (list: GroupedProduct[], row: string, col: string): Product | null => {
    const found = list.find(p =>
      p.tableRowTitle?.includes(row) &&
      (col ? p.tableColTitle?.includes(col) : !p.tableColTitle)
    );
    return found?.product || null;
  };

  const handleButtonClick = (product: Product) => onSelectProduct(product, 1);

  const submitToList = () => {
    let count = 0;
    Object.entries(editableData).forEach(([code, value]) => {
      const qty = parseInt(value);
      if (value && !isNaN(qty) && qty > 0) {
        const product = products.find(p => p.code === code);
        if (product) {
          onSelectProduct(product, qty);
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
          <input type="checkbox" checked={showAsButton} onChange={(e) => setShowAsButton(e.target.checked)} className="sr-only peer" />
          <div className="relative w-14 h-7 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
          <span className="ms-3 text-sm font-medium">{showAsButton ? "切換輸入" : "切換按鈕"}</span>
        </label>
        {!showAsButton && <Button onClick={submitToList} size="sm">確認</Button>}
      </div>

      {Object.entries(groupedProducts).map(([tableTitle, list]) => {
        const cols = getUniqueCols(list);
        const rows = getUniqueRows(list);

        return (
          <div key={tableTitle} className="mb-8">
            <div className="overflow-x-auto border rounded-lg">
              <Table>
                <TableHeader className="bg-muted">
                  <TableRow>
                    <TableHead className="border font-bold w-32 text-center">{tableTitle}</TableHead>
                    {cols.map((col) => <TableHead key={col} className="border text-center">{col}</TableHead>)}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow key={row}>
                      <TableCell className="border font-medium text-center">{row}</TableCell>
                      {cols.length > 0 ? cols.map(col => {
                        const product = getCellProduct(list, row, col);
                        return (
                          <TableCell key={col} className="border text-center">
                            {product ? showAsButton ? (
                              <Button size="sm" variant="default" className="w-full" onClick={() => handleButtonClick(product)}>{product.priceDistribution}</Button>
                            ) : (
                              <Input type="text" value={editableData[product.code] || ""} onChange={(e) => setEditableData({...editableData, [product.code]: e.target.value})} placeholder="數量" className="text-center" />
                            ) : <span className="text-muted-foreground">—</span>}
                          </TableCell>
                        );
                      }) : (
                        <TableCell className="border text-center">
                          {list[0]?.product ? showAsButton ? (
                            <Button size="sm" variant="default" className="w-full" onClick={() => handleButtonClick(list[0].product)}>{list[0].product.priceDistribution}</Button>
                          ) : (
                            <Input type="text" value={editableData[list[0].product.code] || ""} onChange={(e) => setEditableData({...editableData, [list[0].product.code]: e.target.value})} placeholder="數量" className="text-center" />
                          ) : <span className="text-muted-foreground">—</span>}
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        );
      })}
    </div>
  );
};
