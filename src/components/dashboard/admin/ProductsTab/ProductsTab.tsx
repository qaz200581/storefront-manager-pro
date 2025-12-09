import { useState } from "react";
import ProductForm from "./ProductsForm/ProductsForm";
import ProductList from "./ProductsList/ProductList";
import { Product, ProductFormData } from "@/components/dashboard/admin/types";

export default function ProductsTab() {
  const [products, setProducts] = useState<Product[]>([]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [productForm, setProductForm] = useState<ProductFormData>({
    name: "",
    category: "",
    description: "",
    price: 0,
    retail_price: 0,
    dealer_price: 0,
    unit: "",
    stock: 0,
    parent_product_id: "",
  });

  /** 重置表單內容 */
  const onResetForm = () => {
    setProductForm({
      name: "",
      category: "",
      description: "",
      price: 0,
      retail_price: 0,
      dealer_price: 0,
      unit: "",
      stock: 0,
      parent_product_id: "",
      table_settings: [],
    });
    setEditingProduct(null);
  };

  /** 新增或更新產品 */
  const onSubmit = async () => {
    if (editingProduct) {
      // 更新產品
      console.log("更新產品:", productForm);

      // TODO: Supabase update...
      setProducts((prev) =>
        prev.map((p) => (p.id === editingProduct.id ? { ...p, ...productForm } : p))
      );
    } else {
      // 新增產品
      console.log("新增產品:", productForm);

      const newProduct: Product = {
        id: crypto.randomUUID(),
        is_active: true,
        image_url: "", // 可之後再補圖片功能
        ...productForm,
      };

      // TODO: Supabase insert...
      setProducts((prev) => [...prev, newProduct]);
    }

    setIsDialogOpen(false);
    onResetForm();
  };

  /** 按下編輯按鈕 */
  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      category: product.category,
      description: product.description,
      price: product.price,
      retail_price: product.retail_price,
      dealer_price: product.dealer_price,
      unit: product.unit,
      stock: product.stock,
      parent_product_id: product.parent_product_id || "",
    });
    setIsDialogOpen(true);
  };

  /** 刪除產品 */
  const handleDelete = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  /** 上架 / 下架切換 */
  const handleToggleStatus = (product: Product) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === product.id ? { ...p, is_active: !p.is_active } : p
      )
    );
  };

  return (
    <div className="p-4 space-y-6">
      <button
        className="btn btn-primary"
        onClick={() => {
          onResetForm();
          setIsDialogOpen(true);
        }}
      >
        新增產品
      </button>
      {/* 新增/編輯產品表單 */}
      <ProductForm
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        editingProduct={editingProduct}
        productForm={productForm}
        setProductForm={setProductForm}
        onResetForm={onResetForm}
        onSubmit={onSubmit}
        products={products}
      />

      {/* 產品列表 */}
      <ProductList
        products={products}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
      />
    </div>
  );
}
