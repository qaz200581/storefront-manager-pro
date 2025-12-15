// ============================================
// ProductTableInput.tsx - 輸入模式子組件
// ============================================
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Product } from "../../../types";

interface TableProductMapping {
  product: Product;
  settingIndex: number;
  tableTitle: string;
  tableRowTitle: string;
  tableColTitle: string;
}

interface ProductTableInputProps {
  tableTitle: string;
  rows: string[];
  cols: string[];
  mappings: TableProductMapping[];
  editableData: Record<string, string>;
  setEditableData: (data: Record<string, string>) => void;
}

export const ProductTableInput = ({
  tableTitle,
  rows,
  cols,
  mappings,
  editableData,
  setEditableData,
}: ProductTableInputProps) => {
  const getCellProduct = (row: string, col: string): Product | null => {
    const found = mappings.find(
      (m) => m.tableRowTitle === row && (col ? m.tableColTitle === col : !m.tableColTitle)
    );
    return found?.product || null;
  };

  return (
    <Table>
      <TableHeader className="bg-muted">
        <TableRow>
          <TableHead className="border font-bold w-32 text-center">
            {tableTitle}
          </TableHead>
          {cols.length > 0 ? (
            cols.map((col) => (
              <TableHead key={col} className="border text-center">
                {col}
              </TableHead>
            ))
          ) : (
            <TableHead className="border text-center">數量</TableHead>
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.length > 0 ? (
          rows.map((row) => (
            <TableRow key={row}>
              <TableCell className="border font-medium text-center">{row}</TableCell>
              {cols.length > 0 ? (
                cols.map((col) => {
                  const product = getCellProduct(row, col);
                  return (
                    <TableCell key={col} className="border text-center">
                      {product ? (
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-xs text-muted-foreground">${product.price}</span>
                          <Input
                            type="number"
                            min="0"
                            value={editableData[product.id] || ""}
                            onChange={(e) =>
                              setEditableData({ ...editableData, [product.id]: e.target.value })
                            }
                            placeholder="數量"
                            className="text-center h-8"
                          />
                        </div>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                  );
                })
              ) : (
                <TableCell className="border text-center">
                  {mappings[0]?.product ? (
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-xs text-muted-foreground">${mappings[0].product.price}</span>
                      <Input
                        type="number"
                        min="0"
                        value={editableData[mappings[0].product.id] || ""}
                        onChange={(e) =>
                          setEditableData({
                            ...editableData,
                            [mappings[0].product.id]: e.target.value,
                          })
                        }
                        placeholder="數量"
                        className="text-center h-8"
                      />
                    </div>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
              )}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell className="border text-center" colSpan={cols.length + 1}>
              {mappings[0]?.product ? (
                <div className="flex flex-col items-center gap-1">
                  <span className="text-xs text-muted-foreground">${mappings[0].product.price}</span>
                  <Input
                    type="number"
                    min="0"
                    value={editableData[mappings[0].product.id] || ""}
                    onChange={(e) =>
                      setEditableData({
                        ...editableData,
                        [mappings[0].product.id]: e.target.value,
                      })
                    }
                    placeholder="數量"
                    className="text-center max-w-xs mx-auto h-8"
                  />
                </div>
              ) : (
                <span className="text-muted-foreground">暫無產品</span>
              )}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};