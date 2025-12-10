// ProductForm.tsx
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProductFormData, Product } from '@/components/dashboard/admin/types';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import TableSettings from './ProductTableForm';

interface ProductFormProps {
    isDialogOpen: boolean;
    setIsDialogOpen: (open: boolean) => void;
    editingProduct: Product | null;
    productForm: ProductFormData;
    setProductForm: (form: ProductFormData) => void;
    onResetForm: () => void;
    onSubmit: () => void;
    products: Product[];
}

export default function ProductForm({
    isDialogOpen,
    setIsDialogOpen,
    editingProduct,
    productForm,
    setProductForm,
    onResetForm,
    onSubmit,
    products,
}: ProductFormProps) {
    const availableParentProducts = products.filter(
        (p) => p.id !== editingProduct?.id && !p.parent_product_id
    );

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
                                <Label>產品品牌</Label>
                                <Input
                                    value={productForm.brand}
                                    onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                                    placeholder="輸入產品名稱"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>產品系列 *</Label>
                                <Input
                                    value={productForm.series}
                                    onChange={(e) => setProductForm({ ...productForm, series: e.target.value })}
                                    placeholder="輸入產品系列"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>產品型號 *</Label>
                                <Input
                                    value={productForm.model}
                                    onChange={(e) => setProductForm({ ...productForm, model: e.target.value })}
                                    placeholder="輸入產品型號"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>產品顏色 *</Label>
                                <Input
                                    value={productForm.color}
                                    onChange={(e) => setProductForm({ ...productForm, color: e.target.value })}
                                    placeholder="輸入產品顏色"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>產品條碼 *</Label>
                                <Input
                                    value={productForm.barcode}
                                    onChange={(e) => setProductForm({ ...productForm, barcode: e.target.value })}
                                    placeholder="輸入產品條碼"
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

                        <TableSettings
                            tableSettings={productForm.table_settings}
                            onUpdate={(settings) => setProductForm({ ...productForm, table_settings: settings })}
                        />

                        <Button onClick={onSubmit} className="w-full">
                            {editingProduct ? '更新產品' : '新增產品'}
                        </Button>
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}