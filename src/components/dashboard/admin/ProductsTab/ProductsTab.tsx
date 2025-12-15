import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ProductForm from "./ProductsForm/ProductsForm";
import ProductList from "./ProductsList/ProductList";
import { Product, ProductFormData } from "@/components/dashboard/admin/types";

const initialProductForm: ProductFormData = {
  name: "",
  brand: "",
  series: "",
  model: "",
  color: "",
  category: "",
  description: "",
  price: "",
  retail_price: "",
  dealer_price: "",
  barcode: "",
  unit: "個",
  stock: "",
  parent_product_id: "",
  table_settings: [],
};

export default function ProductsTab() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState<ProductFormData>(initialProductForm);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("無法載入產品");
      return;
    }
    console.log("產品資料格式", data)
    setProducts(data || []);
  };

  const onResetForm = () => {
    setProductForm(initialProductForm);
    setEditingProduct(null);
  };

  const onSubmit = async () => {
    if (!productForm.name || !productForm.retail_price) {
      toast.error("請填寫產品名稱和零售價");
      return;
    }

    const productData = {
      name: productForm.name.trim(),
      brand: productForm.brand?.trim() || null,
      series: productForm.series?.trim() || null,
      model: productForm.model?.trim() || null,
      color: productForm.color?.trim() || null,
      description: productForm.description?.trim() || null,
      price: parseFloat(productForm.price) || parseFloat(productForm.retail_price) || 0,
      retail_price: parseFloat(productForm.retail_price) || null,
      dealer_price: productForm.dealer_price ? parseFloat(productForm.dealer_price) : null,
      unit: productForm.unit,
      stock: parseInt(productForm.stock) || 0,
      category: productForm.category?.trim() || null,
      parent_product_id: productForm.parent_product_id || null,
      status: editingProduct ? editingProduct.status : '上架中',
      table_settings: productForm.table_settings || [],
      barcode: productForm.barcode?.trim() || null,
    };

    if (editingProduct) {
      const { error } = await supabase
        .from("products")
        .update(productData)
        .eq("id", editingProduct.id);

      if (error) {
        toast.error("更新產品失敗");
        return;
      }
      toast.success("產品已更新");
    } else {
      const { error } = await supabase.from("products").insert(productData);

      if (error) {
        toast.error("新增產品失敗");
        return;
      }
      toast.success("產品已新增");
    }

    setIsDialogOpen(false);
    onResetForm();
    fetchProducts();
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      brand: product.brand,
      series: product.series,
      model: product.model,
      barcode: product.barcode || "",
      color: product.color,
      category: product.category || "",
      description: product.description || "",
      price: product.price?.toString() || "",
      retail_price: product.retail_price?.toString() || "",
      dealer_price: product.dealer_price?.toString() || "",
      unit: product.unit,
      stock: product.stock?.toString() || "",
      parent_product_id: product.parent_product_id || "",
      table_settings: product.table_settings || [],
    });
    setIsDialogOpen(true);
  };

  /**
   * 💡 新增複製產品的邏輯
   * 將現有產品資料載入表單，但清除其 ID，準備以新增模式提交
   */
  const handleDuplicate = (productToCopy: Product) => {
    setEditingProduct(null); // 確保是新增模式
    setProductForm({
      // 繼承所有欄位
      name: `${productToCopy.name} (副本)`, // 更改名稱以避免與舊產品混淆
      brand: productToCopy.brand,
      series: productToCopy.series,
      model: productToCopy.model,
      color: productToCopy.color,
      category: productToCopy.category || "",
      description: productToCopy.description || "",
      price: productToCopy.price?.toString() || "",
      retail_price: productToCopy.retail_price?.toString() || "",
      dealer_price: productToCopy.dealer_price?.toString() || "",
      unit: productToCopy.unit,
      stock: productToCopy.stock?.toString() || "", // 庫存通常也需要重新確認
      parent_product_id: productToCopy.parent_product_id || "",
      table_settings: productToCopy.table_settings || [],
      // 條碼通常是唯一的，強制用戶重新輸入或修改
      barcode: productToCopy.barcode ? `${productToCopy.barcode}-COPY` : "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) {
      toast.error("刪除產品失敗");
      return;
    }

    toast.success("產品已刪除");
    fetchProducts();
  };

  const handleChangeStatus = async (productId: string, newState: Product['status']) => {
    const { error } = await supabase
      .from('products')
      .update({ status: newState })
      .eq('id', productId);

    if (error) {
      toast.error('更新狀態失敗');
      return;
    }

    toast.success(`產品狀態已更新為 ${newState}`);
    fetchProducts();
  };


  return (
    <div className="space-y-4">
      <div className="flex flex-wrap justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">產品列表</h2>
        <Button
          onClick={() => {
            onResetForm();
            setIsDialogOpen(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          新增產品
        </Button>
      </div>


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

      <ProductList
        products={products}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onChangeStatus={handleChangeStatus}
        // 傳遞新的複製功能
        onDuplicate={handleDuplicate}
      />
    </div>
  );
}