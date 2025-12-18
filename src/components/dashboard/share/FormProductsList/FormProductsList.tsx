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
import { Product, TableSetting } from "@/components/dashboard/share/types";

interface ProductTableViewProps {
  products: Product[];
  onSelectProduct: (product: Product, quantity: number) => void;
}

interface GroupedProduct {
  productId: string;
  name: string;
  price: number;
  unit: string;
  tableTitle: string;
  tableRowTitle: string;
  tableColTitle: string;
  originalProduct: Product;
}

const FormProductsList = ({
  products,
  onSelectProduct,
}: ProductTableViewProps) => {
  const [showAsButton, setShowAsButton] = useState(true);
  const [editableData, setEditableData] = useState<Record<string, string>>({});

  // 按 tableTitle 分組產品
  const groupedProducts = useMemo(() => {
    const grouped: Record<string, GroupedProduct[]> = {};

    products.forEach((product) => {
      const settings = product.table_settings || [];
      if (settings.length === 0) return;
      
      settings.forEach((setting: TableSetting) => {
        const title = setting.table_title;
        if (!title) return;
        
        if (!grouped[title]) grouped[title] = [];
        grouped[title].push({
          productId: product.id,
          name: product.name,
          price: product.price,
          unit: product.unit,
          tableTitle: title,
          tableRowTitle: setting.table_row_title || '',
          tableColTitle: setting.table_col_title || '',
          originalProduct: product,
        });
      });
    });

    return grouped;
  }, [products]);

  // 橫向欄位：表格第一列
  const getUniqueCols = (items: GroupedProduct[]) =>
    [...new Set(items.map((p) => p.tableColTitle))].filter(Boolean);

  // 縱向欄位：表格第一欄
  const getUniqueRows = (items: GroupedProduct[]) =>
    [...new Set(items.map((p) => p.tableRowTitle))].filter(Boolean);

  // 取得某格對應產品
  const getCellProduct = (
    tableTitle: string,
    row: string,
    col: string
  ): GroupedProduct | null => {
    return (
      groupedProducts[tableTitle]?.find(
        (p) =>
          p.tableRowTitle === row &&
          (col ? p.tableColTitle === col : !p.tableColTitle)
      ) || null
    );
  };

  // 點擊按鈕加入單項
  const handleButtonClick = (productId: string) => {
    const product = products.find((item) => item.id === productId);
    if (product) {
      onSelectProduct(product, 1);
    }
  };

  // 批量確認加入
  const submitToList = () => {
    let count = 0;
    Object.entries(editableData).forEach(([productId, value]) => {
      const qty = parseInt(value);

      if (value && !isNaN(qty) && qty > 0) {
        const product = products.find((item) => item.id === productId);
        if (product) {
          onSelectProduct(product, qty);
          count++;
        }
      }
    });

    if (count > 0) {
      toast.success(`已批量添加 ${count} 項產品`);
      setEditableData({});
    } else {
      toast.error("請先輸入產品數量");
    }
  };

  // 更新輸入數量
  const handleInputChange = (productId: string, value: string) => {
    setEditableData((prev) => ({ ...prev, [productId]: value }));
  };

  if (Object.keys(groupedProducts).length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* 各表格區塊 */}
      {Object.entries(groupedProducts).map(([tableTitle, list]) => {
        const cols = getUniqueCols(list);
        const rows = getUniqueRows(list);

        return (
          <div key={tableTitle} className="mb-8">
            <div className="overflow-x-auto border rounded-lg">
              <Table>
                <TableHeader className="bg-muted">
                  <TableRow>
                    <TableHead className="border font-bold w-32 text-center">
                      {tableTitle}
                    </TableHead>
                    {cols.map((col) => (
                      <TableHead key={col} className="border text-center">
                        {col}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow key={row}>
                      <TableCell className="border font-medium text-center">
                        {row}
                      </TableCell>
                      {cols.length > 0 ? (
                        cols.map((col) => {
                          const item = getCellProduct(tableTitle, row, col);
                          return (
                            <TableCell key={col} className="border text-center">
                              {item ? (
                                showAsButton ? (
                                  <Button
                                    size="sm"
                                    variant="default"
                                    onClick={() => handleButtonClick(item.productId)}
                                    className="w-full"
                                  >
                                    {item.price}
                                  </Button>
                                ) : (
                                  <Input
                                    type="text"
                                    value={editableData[item.productId] || ""}
                                    onChange={(e) =>
                                      handleInputChange(item.productId, e.target.value)
                                    }
                                    placeholder="數量"
                                    className="text-center"
                                  />
                                )
                              ) : (
                                <span className="text-muted-foreground">—</span>
                              )}
                            </TableCell>
                          );
                        })
                      ) : (
                        <TableCell className="border text-center">
                          {list.find((p) => p.tableRowTitle === row) ? (
                            showAsButton ? (
                              <Button
                                size="sm"
                                variant="default"
                                onClick={() =>
                                  handleButtonClick(
                                    list.find((p) => p.tableRowTitle === row)!.productId
                                  )
                                }
                                className="w-full"
                              >
                                {list.find((p) => p.tableRowTitle === row)!.price}
                              </Button>
                            ) : (
                              <Input
                                type="text"
                                value={
                                  editableData[
                                    list.find((p) => p.tableRowTitle === row)!.productId
                                  ] || ""
                                }
                                onChange={(e) =>
                                  handleInputChange(
                                    list.find((p) => p.tableRowTitle === row)!.productId,
                                    e.target.value
                                  )
                                }
                                placeholder="數量"
                                className="text-center"
                              />
                            )
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
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

export default FormProductsList;