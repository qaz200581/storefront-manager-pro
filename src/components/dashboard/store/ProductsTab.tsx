import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Package, Plus } from 'lucide-react';
import { Product } from './types';

interface ProductsTabProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

export default function ProductsTab({ products, onAddToCart }: ProductsTabProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">產品目錄</h2>

      {products.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>目前沒有可訂購的產品</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map((product, index) => (
            <Card
              key={product.id}
              className="animate-slide-up overflow-hidden hover:shadow-lg transition-shadow"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg">{product.name}</h3>
                    {product.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {product.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-primary">
                        ${product.price}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        每{product.unit}
                      </p>
                    </div>
                    <Button onClick={() => onAddToCart(product)} size="sm">
                      <Plus className="w-4 h-4 mr-1" />
                      加入
                    </Button>
                  </div>
                  {product.stock > 0 && product.stock < 10 && (
                    <p className="text-xs text-warning">庫存剩餘 {product.stock} {product.unit}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
