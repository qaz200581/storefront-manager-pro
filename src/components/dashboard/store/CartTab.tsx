import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';
import { CartItem } from './types';

interface CartTabProps {
  cart: CartItem[];
  cartTotal: number;
  orderNotes: string;
  isSubmitting: boolean;
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onNotesChange: (notes: string) => void;
  onSubmitOrder: () => void;
}

export default function CartTab({
  cart,
  cartTotal,
  orderNotes,
  isSubmitting,
  onUpdateQuantity,
  onRemoveItem,
  onNotesChange,
  onSubmitOrder,
}: CartTabProps) {
  if (cart.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">購物車</h2>
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>購物車是空的</p>
            <p className="text-sm mt-2">前往產品目錄選購產品</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">購物車</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <Card key={item.product.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-medium">{item.product.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      ${item.product.price} / {item.product.unit}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onUpdateQuantity(item.product.id, -1)}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-8 text-center font-medium">
                      {item.quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onUpdateQuantity(item.product.id, 1)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onRemoveItem(item.product.id)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                  <div className="w-24 text-right">
                    <p className="font-semibold">
                      ${(item.product.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>訂單摘要</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {cart.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex justify-between text-sm"
                  >
                    <span>
                      {item.product.name} x {item.quantity}
                    </span>
                    <span>
                      ${(item.product.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>總計</span>
                  <span className="text-primary">${cartTotal.toLocaleString()}</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">備註</label>
                <Textarea
                  value={orderNotes}
                  onChange={(e) => onNotesChange(e.target.value)}
                  placeholder="特殊需求或備註..."
                  rows={3}
                />
              </div>
              <Button
                variant="gradient"
                size="lg"
                className="w-full"
                onClick={onSubmitOrder}
                disabled={isSubmitting}
              >
                {isSubmitting ? '送出中...' : '確認訂購'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
