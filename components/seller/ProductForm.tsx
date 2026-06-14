"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Loader2, Upload, X } from "lucide-react";
import type { ChangeEvent, FormEvent } from "react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { calculateDiscount } from "@/lib/utils";
import type { Product } from "@/types";

const fabrics = ["Silk", "Cotton", "Georgette", "Chiffon", "Crepe", "Linen", "Banarasi"];
const occasions = ["Wedding", "Festive", "Casual", "Party", "Office", "Daily Wear"];
const colors = ["Red", "Pink", "Gold", "Green", "Blue", "Black", "Purple", "Ivory"];
const sizes = ["Free Size", "S", "M", "L", "XL", "XXL"];
const categories = ["Saree", "Silk Saree", "Cotton Saree", "Designer Saree", "Bridal Saree"];

interface ProductFormProps {
  mode: "create" | "edit";
  initialProduct?: Partial<Product> & { id?: string };
}

export function ProductForm({ mode, initialProduct }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [name, setName] = useState(initialProduct?.name ?? "");
  const [description, setDescription] = useState(initialProduct?.description ?? "");
  const [category, setCategory] = useState(initialProduct?.category ?? "Saree");
  const [subcategory, setSubcategory] = useState(initialProduct?.subcategory ?? "");
  const [fabric, setFabric] = useState(initialProduct?.fabric ?? fabrics[0]);
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>(initialProduct?.occasion ?? []);
  const [selectedColors, setSelectedColors] = useState<string[]>(initialProduct?.color ?? []);
  const [selectedSizes, setSelectedSizes] = useState<string[]>(initialProduct?.sizes ?? ["Free Size"]);
  const [price, setPrice] = useState(String(initialProduct?.price ?? ""));
  const [mrp, setMrp] = useState(String(initialProduct?.mrp ?? ""));
  const [stock, setStock] = useState(String(initialProduct?.stock ?? 10));
  const [images, setImages] = useState<string[]>(initialProduct?.images ?? []);
  const [tags, setTags] = useState((initialProduct?.tags ?? []).join(", "));
  const [isFeatured, setIsFeatured] = useState(Boolean(initialProduct?.isFeatured));

  const discount = useMemo(() => {
    const sellingPrice = Number(price);
    const baseMrp = Number(mrp);
    if (!sellingPrice || !baseMrp) return "0% off";
    return calculateDiscount(baseMrp, sellingPrice);
  }, [mrp, price]);

  const toggleValue = (value: string, selected: string[], setter: (next: string[]) => void) => {
    setter(selected.includes(value) ? selected.filter((item) => item !== value) : [...selected, value]);
  };

  const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;

    try {
      setUploading(true);
      const uploaded = await Promise.all(
        files.map(async (file) => {
          const formData = new FormData();
          formData.append("image", file);
          const response = await fetch("/api/upload", { method: "POST", body: formData });
          const result = await response.json();
          if (!response.ok) {
            throw new Error(result.error || "Image upload failed.");
          }
          return result.url as string;
        }),
      );
      setImages((current) => [...current, ...uploaded]);
      toast({ title: "Images uploaded", variant: "success" });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "error",
      });
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!images.length) {
      toast({ title: "At least one image is required", variant: "error" });
      return;
    }

    try {
      setLoading(true);
      const payload = {
        name,
        description,
        category,
        subcategory,
        fabric,
        occasion: selectedOccasions,
        color: selectedColors,
        sizes: selectedSizes,
        price: Number(price),
        mrp: Number(mrp),
        stock: Number(stock),
        images,
        tags: tags.split(",").map((tag) => tag.trim()).filter(Boolean),
        isFeatured,
      };

      const endpoint = mode === "create" ? "/api/seller/products" : `/api/seller/products/${initialProduct?.id}`;
      const response = await fetch(endpoint, {
        method: mode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to save product.");
      }

      toast({
        title: mode === "create" ? "Product added" : "Product updated",
        description: name,
        variant: "success",
      });
      router.push("/seller/products");
      router.refresh();
    } catch (error) {
      toast({
        title: "Unable to save product",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6 rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <Input label="Product name" value={name} onChange={(event) => setName(event.target.value)} required />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="block text-sm font-medium text-dark">Description</label>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={6}
                required
                className="w-full rounded-3xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-dark">Category</label>
              <select value={category} onChange={(event) => setCategory(event.target.value)} className="h-11 w-full rounded-2xl border border-zinc-200 bg-white px-4 text-sm outline-none focus:border-primary">
                {categories.map((item) => <option key={item}>{item}</option>)}
              </select>
            </div>
            <Input label="Subcategory" value={subcategory} onChange={(event) => setSubcategory(event.target.value)} />
            <div>
              <label className="mb-2 block text-sm font-medium text-dark">Fabric</label>
              <select value={fabric} onChange={(event) => setFabric(event.target.value)} className="h-11 w-full rounded-2xl border border-zinc-200 bg-white px-4 text-sm outline-none focus:border-primary">
                {fabrics.map((item) => <option key={item}>{item}</option>)}
              </select>
            </div>
            <Input label="Tags" value={tags} onChange={(event) => setTags(event.target.value)} placeholder="wedding, premium, handcrafted" />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <p className="mb-3 text-sm font-semibold text-dark">Occasion</p>
              <div className="flex flex-wrap gap-2">
                {occasions.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleValue(item, selectedOccasions, setSelectedOccasions)}
                    className={`rounded-full border px-4 py-2 text-sm transition ${selectedOccasions.includes(item) ? "border-primary bg-primary text-white" : "border-zinc-200 bg-white text-zinc-600"}`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-3 text-sm font-semibold text-dark">Sizes</p>
              <div className="flex flex-wrap gap-2">
                {sizes.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleValue(item, selectedSizes, setSelectedSizes)}
                    className={`rounded-full border px-4 py-2 text-sm transition ${selectedSizes.includes(item) ? "border-primary bg-primary text-white" : "border-zinc-200 bg-white text-zinc-600"}`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold text-dark">Colours</p>
            <div className="flex flex-wrap gap-3">
              {colors.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => toggleValue(item, selectedColors, setSelectedColors)}
                  className={`rounded-full border px-4 py-2 text-sm transition ${selectedColors.includes(item) ? "border-primary bg-primary text-white" : "border-zinc-200 bg-white text-zinc-600"}`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6 rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="grid gap-5 sm:grid-cols-2">
            <Input label="Selling price" type="number" value={price} onChange={(event) => setPrice(event.target.value)} required />
            <Input label="MRP" type="number" value={mrp} onChange={(event) => setMrp(event.target.value)} required />
            <Input label="Stock quantity" type="number" value={stock} onChange={(event) => setStock(event.target.value)} required />
            <div className="rounded-3xl bg-cream p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Auto discount</p>
              <p className="mt-2 text-xl font-bold text-primary">{discount}</p>
            </div>
          </div>

          <label className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-cream px-4 py-3 text-sm font-medium text-dark">
            <input type="checkbox" checked={isFeatured} onChange={(event) => setIsFeatured(event.target.checked)} className="h-4 w-4 rounded border-zinc-300 text-primary" />
            Mark as featured on the storefront
          </label>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-dark">Product images</p>
                <p className="text-xs text-zinc-500">Upload multiple 3:4 lifestyle or studio shots.</p>
              </div>
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/90">
                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                Upload
                <input type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} disabled={uploading} />
              </label>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {images.map((image) => (
                <div key={image} className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-cream">
                  <div className="relative aspect-[3/4]">
                    <Image src={image} alt={name || "Product image"} fill className="object-cover" sizes="200px" />
                  </div>
                  <button
                    type="button"
                    onClick={() => setImages((current) => current.filter((item) => item !== image))}
                    className="absolute right-2 top-2 rounded-full bg-white/90 p-1.5 text-dark shadow-sm transition hover:text-rose-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <Button variant="accent" size="lg" type="submit" disabled={loading || uploading} className="w-full">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {mode === "create" ? "Publish Product" : "Save Changes"}
          </Button>
        </div>
      </div>
    </form>
  );
}
