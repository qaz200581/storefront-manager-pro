import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Product, ProductFormData } from './types';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ProductsTabProps {
  products: Product[];
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  editingProduct: Product | null;
  productForm: ProductFormData;
  setProductForm: (form: ProductFormData) => void;
  onResetForm: () => void;
  onSubmit: () => void;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (product: Product) => void;
}

export default function ProductsTab({
  products,
  isDialogOpen,
  setIsDialogOpen,
  editingProduct,
  productForm,
  setProductForm,
  onResetForm,
  onSubmit,
  onEdit,
  onDelete,
  onToggleStatus,
}: ProductsTabProps) {
  // Filter products that can be parent (exclude current editing product)
  const availableParentProducts = products.filter(
    (p) => p.id !== editingProduct?.id && !p.parent_product_id
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">產品列表</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={onResetForm}>
              <Plus className="w-4 h-4 mr-2" />
              新增產品
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>{editingProduct ? '編輯產品' : '新增產品'}</DialogTitle>
              <DialogDescription>
                {editingProduct ? '修改產品資訊' : '填寫產品資訊以新增產品'}
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[70vh] pr-4">
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>產品名稱 *</Label>
                    <Input
                      value={productForm.name}
                      onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                      placeholder="輸入產品名稱"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>分類</Label>
                    <Input
                      value={productForm.category}
                      onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                      placeholder="輸入分類"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>產品描述</Label>
                  <Textarea
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    placeholder="輸入產品描述"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>原價</Label>
                    <Input
                      type="number"
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>零售價 *</Label>
                    <Input
                      type="number"
                      value={productForm.retail_price}
                      onChange={(e) => setProductForm({ ...productForm, retail_price: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>經銷價</Label>
                    <Input
                      type="number"
                      value={productForm.dealer_price}
                      onChange={(e) => setProductForm({ ...productForm, dealer_price: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>單位</Label>
                    <Input
                      value={productForm.unit}
                      onChange={(e) => setProductForm({ ...productForm, unit: e.target.value })}
                      placeholder="個"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>庫存數量</Label>
                    <Input
                      type="number"
                      value={productForm.stock}
                      onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>主商品</Label>
                  <Select
                    value={productForm.parent_product_id || 'none'}
                    onValueChange={(value) =>
                      setProductForm({ ...productForm, parent_product_id: value === 'none' ? '' : value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="選擇主商品（可選）" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">無（獨立商品）</SelectItem>
                      {availableParentProducts.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">表格式下單設定</h4>

                  <div className="space-y-4">
                    {productForm.table_settings.map((setting, index) => (
                      <div
                        key={setting.id}
                        className="border p-4 rounded-md relative bg-muted/30 space-y-3"
                      >
                        <button
                          className="absolute top-2 right-2 text-sm text-red-500"
                          onClick={() => {
                            const updated = productForm.table_settings.filter((_, i) => i !== index)
                            setProductForm({ ...productForm, table_settings: updated })
                          }}
                        >
                          刪除
                        </button>

                        <div className="space-y-2">
                          <Label>表格標題 (Table Title)</Label>
                          <Input
                            value={setting.table_title}
                            onChange={(e) => {
                              const updated = [...productForm.table_settings]
                              updated[index].table_title = e.target.value
                              setProductForm({ ...productForm, table_settings: updated })
                            }}
                            placeholder="例：尺寸規格表"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>列標題 (Row Title)</Label>
                            <Input
                              value={setting.table_row_title}
                              onChange={(e) => {
                                const updated = [...productForm.table_settings]
                                updated[index].table_row_title = e.target.value
                                setProductForm({ ...productForm, table_settings: updated })
                              }}
                              placeholder="例：顏色"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>欄標題 (Column Title)</Label>
                            <Input
                              value={setting.table_col_title}
                              onChange={(e) => {
                                const updated = [...productForm.table_settings]
                                updated[index].table_col_title = e.target.value
                                setProductForm({ ...productForm, table_settings: updated })
                              }}
                              placeholder="例：尺寸"
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() =>
                        setProductForm({
                          ...productForm,
                          table_settings: [
                            ...productForm.table_settings,
                            {
                              id: crypto.randomUUID(),
                              table_title: '',
                              table_row_title: '',
                              table_col_title: '',
                            },
                          ],
                        })
                      }
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      新增一組表格設定
                    </Button>
                  </div>
                </div>


                <Button onClick={onSubmit} className="w-full">
                  {editingProduct ? '更新產品' : '新增產品'}
                </Button>
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>產品名稱</TableHead>
                <TableHead>分類</TableHead>
                <TableHead>零售價</TableHead>
                <TableHead>經銷價</TableHead>
                <TableHead>庫存</TableHead>
                <TableHead>狀態</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    尚無產品，點擊上方按鈕新增
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        {product.description && (
                          <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                            {product.description}
                          </p>
                        )}

                      </div>
                    </TableCell>
                    <TableCell>
                      {product.category || <span className="text-muted-foreground">-</span>}
                    </TableCell>
                    <TableCell>
                      ${product.retail_price || product.price}/{product.unit}
                    </TableCell>
                    <TableCell>
                      {product.dealer_price ? (
                        `$${product.dealer_price}/${product.unit}`
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>
                      <Badge
                        variant={product.is_active ? 'default' : 'secondary'}
                        className="cursor-pointer"
                        onClick={() => onToggleStatus(product)}
                      >
                        {product.is_active ? '上架中' : '已下架'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(product)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDelete(product.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
