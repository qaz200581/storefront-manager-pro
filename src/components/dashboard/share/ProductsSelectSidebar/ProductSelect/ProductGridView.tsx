import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { Product } from "../../types";

interface ProductGridViewProps {
  products: Product[];
  onSelectProduct: (product: Product, quantity: number) => void;
}

export const ProductGridView = ({ products, onSelectProduct }: ProductGridViewProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
      {products.map((product) => (
        <Card
          key={product.id}
          className="hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => onSelectProduct(product, 1)}
        >
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-xs">{product.brand} • {product.series}</h4>
                  </div>
                  <p className="text-s font-bold text-muted-foreground mt-1">{product.model}</p>
                  <p className="text-sm text-muted-foreground">{product.color}</p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t">
                <span className="text-lg font-bold text-primary">${product.priceDistribution}</span>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectProduct(product, 1);
                  }}
                >
                  <ShoppingCart className="w-4 h-4 mr-1" />
                  加入
                </Button>

              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
