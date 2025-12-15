import { Button } from "@/components/ui/button";
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

interface ProductTableButtonProps {
  tableTitle: string;
  rows: string[];
  cols: string[];
  mappings: TableProductMapping[];
  onSelectProduct: (product: Product) => void;
}

export const ProductTableButton = ({
  tableTitle,
  rows,
  cols,
  mappings,
  onSelectProduct,
}: ProductTableButtonProps) => {
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
            <TableHead className="border text-center">選項</TableHead>
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
                        <Button
                          size="sm"
                          variant="default"
                          className="w-full"
                          onClick={() => onSelectProduct(product)}
                        >
                          ${product.price}
                        </Button>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                  );
                })
              ) : (
                <TableCell className="border text-center">
                  {mappings[0]?.product ? (
                    <Button
                      size="sm"
                      variant="default"
                      className="w-full"
                      onClick={() => onSelectProduct(mappings[0].product)}
                    >
                      ${mappings[0].product.price}
                    </Button>
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
                <Button
                  size="sm"
                  variant="default"
                  onClick={() => onSelectProduct(mappings[0].product)}
                >
                  ${mappings[0].product.price}
                </Button>
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
