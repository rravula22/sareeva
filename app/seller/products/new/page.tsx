import { ProductForm } from "@/components/seller/ProductForm";

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">New listing</p>
        <h1 className="mt-2 text-3xl font-bold text-dark">Add Product</h1>
      </div>
      <ProductForm mode="create" />
    </div>
  );
}
