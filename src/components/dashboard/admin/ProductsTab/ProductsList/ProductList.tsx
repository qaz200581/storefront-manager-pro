import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Product } from '@/components/dashboard/admin/types';
import { Switch } from '@/components/ui/switch';

interface ProductListProps {
    products: Product[];
    onEdit: (product: Product) => void;
    onDelete: (id: string) => void;
    onToggleActive: (productId: string, isActive: boolean) => void;
}

export default function ProductList({ products, onEdit, onDelete, onToggleActive }: ProductListProps) {
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
                            <TableHead>上架</TableHead>
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
                                        <div className="flex items-center gap-2">
                                            <Switch
                                                checked={product.is_active}
                                                onCheckedChange={(checked) => onToggleActive(product.id, checked)}
                                            />
                                            <Badge variant={product.is_active ? 'default' : 'secondary'}>
                                                {product.is_active ? '上架中' : '已下架'}
                                            </Badge>
                                        </div>
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
