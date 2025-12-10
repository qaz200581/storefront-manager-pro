import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Product } from '@/components/dashboard/admin/types';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

interface ProductListProps {
    products: Product[];
    onEdit: (product: Product) => void;
    onDelete: (id: string) => void;
    onChangeStatus: (productId: string, newStatus: Product['status']) => void;
}

const statusOptions: Product['status'][] = ['上架中', '已下架', '預購中', '售完'];

const statusVariants: Record<Product['status'], 'default' | 'secondary' | 'destructive' | 'outline'> = {
    '上架中': 'default',
    '已下架': 'secondary',
    '預購中': 'outline',
    '售完': 'destructive',
};

export default function ProductList({ products, onEdit, onDelete, onChangeStatus }: ProductListProps) {
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
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => onEdit(product)}>
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => onDelete(product.id)}>
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
    );
}
