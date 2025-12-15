import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Edit, Trash2, Copy } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'; // 假設您的 Popover 組件路徑
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Product } from '@/components/dashboard/admin/types';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

interface ProductListProps {
    products: Product[];
    onEdit: (product: Product) => void;
    onDelete: (id: string) => void;
    onChangeStatus: (productId: string, newStatus: Product['status']) => void;
    onDuplicate: (product: Product) => void;
}

const statusOptions: Product['status'][] = ['上架中', '售完停產', '預購中', '停產'];

const statusVariants: Record<Product['status'], 'default' | 'destructive' | 'destructive' | 'outline'> = {
    '上架中': 'default',
    '售完停產': 'destructive',
    '預購中': 'outline',
    '停產': 'destructive',
};

export default function ProductList({ products, onEdit, onDelete, onChangeStatus, onDuplicate }: ProductListProps) {
    return (
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
                                    尚無產品
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

                                    <TableCell>{product.category || '-'}</TableCell>
                                    <TableCell>${product.retail_price || product.price}/{product.unit}</TableCell>
                                    <TableCell>{product.dealer_price ? `$${product.dealer_price}/${product.unit}` : '-'}</TableCell>
                                    <TableCell>{product.stock}</TableCell>

                                    <TableCell>
                                        <Select
                                            value={product.status}
                                            onValueChange={(value) => onChangeStatus(product.id, value as Product['status'])}
                                        >
                                            <SelectTrigger className="w-28">
                                                <Badge variant={statusVariants[product.status]}>
                                                    {product.status}
                                                </Badge>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {statusOptions.map((status) => (
                                                    <SelectItem key={status} value={status}>
                                                        <Badge variant={statusVariants[status]}>{status}</Badge>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </TableCell>

                                    <TableCell className="text-right">
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">產品操作</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </PopoverTrigger>

                                            {/* Popover 內容：使用 flex column 呈現按鈕組 */}
                                            <PopoverContent className="w-40 p-2 space-y-1" align="end">
                                                {/* 編輯按鈕 */}
                                                <Button
                                                    variant="ghost"
                                                    className="w-full justify-start"
                                                    onClick={() => onEdit(product)}
                                                >
                                                    <Edit className="mr-2 h-4 w-4" /> 編輯
                                                </Button>

                                                {/* 複製按鈕 */}
                                                <Button
                                                    variant="ghost"
                                                    className="w-full justify-start"
                                                    onClick={() => onDuplicate(product)}
                                                >
                                                    <Copy className="mr-2 h-4 w-4" /> 複製
                                                </Button>

                                                {/* 刪除按鈕 */}
                                                <Button
                                                    variant="destructive"
                                                    className="w-full justify-start"
                                                    onClick={() => onDelete(product.id)}
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" /> 刪除
                                                </Button>
                                            </PopoverContent>
                                        </Popover>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
