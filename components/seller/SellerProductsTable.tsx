"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Pencil, Search, Trash2 } from "lucide-react";
import type { FormEvent } from "react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";

interface SellerProductsTableProps {
  products: Product[];
  page: number;
  totalPages: number;
  search: string;
}

export function SellerProductsTable({ products, page, totalPages, search }: SellerProductsTableProps) {
  const router = useRouter();
  const [query, setQuery] = useState(search);
  const [busyId, setBusyId] = useState<string | null>(null);

  const navigateToPage = (nextPage: number) => {
    const params = new URLSearchParams();
    if (query.trim()) params.set("search", query.trim());
    params.set("page", String(nextPage));
    router.push(`/seller/products?${params.toString()}`);
  };

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("search", query.trim());
    router.push(`/seller/products${params.toString() ? `?${params.toString()}` : ""}`);
  };

  const toggleStatus = async (product: Product) => {
    try {
      setBusyId(product.id);
      const response = await fetch(`/api/seller/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !product.isActive }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to update product.");
      toast({ title: "Listing updated", description: product.name, variant: "success" });
      router.refresh();
    } catch (error) {
      toast({ title: "Unable to update", description: error instanceof Error ? error.message : "Please try again.", variant: "error" });
    } finally {
      setBusyId(null);
    }
  };

  const deactivateProduct = async (product: Product) => {
    try {
      setBusyId(product.id);
      const response = await fetch(`/api/seller/products/${product.id}`, { method: "DELETE" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to remove product.");
      toast({ title: "Listing archived", description: product.name, variant: "success" });
      router.refresh();
    } catch (error) {
      toast({ title: "Unable to archive", description: error instanceof Error ? error.message : "Please try again.", variant: "error" });
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-[2rem] border border-zinc-200 bg-white p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <form onSubmit={handleSearch} className="relative w-full max-w-md">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name or fabric"
            className="h-11 w-full rounded-full border border-zinc-200 bg-cream pl-11 pr-4 text-sm outline-none focus:border-primary"
          />
        </form>
        <Button variant="accent" asChild>
          <Link href="/seller/products/new">Add New Product</Link>
        </Button>
      </div>

      <div className="overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-zinc-100 text-sm">
            <thead className="bg-cream/80 text-left text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
              <tr>
                <th className="px-6 py-4">Image</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-zinc-50/80">
                  <td className="px-6 py-4">
                    <div className="relative h-16 w-12 overflow-hidden rounded-xl bg-cream">
                      <Image src={product.images[0]} alt={product.name} fill className="object-cover" sizes="48px" />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-dark">{product.name}</p>
                    <p className="text-xs text-zinc-500">{product.fabric}</p>
                  </td>
                  <td className="px-6 py-4 text-zinc-600">{product.category}</td>
                  <td className="px-6 py-4 font-semibold text-dark">{formatPrice(product.price)}</td>
                  <td className="px-6 py-4 text-zinc-600">{product.stock}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleStatus(product)}
                      disabled={busyId === product.id}
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${product.isActive ? "bg-emerald-100 text-emerald-700" : "bg-zinc-100 text-zinc-600"}`}
                    >
                      {busyId === product.id ? "Saving..." : product.isActive ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/seller/products/${product.id}/edit`}>
                          <Pencil className="h-4 w-4" />
                          Edit
                        </Link>
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => deactivateProduct(product)} disabled={busyId === product.id}>
                        {busyId === product.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                        Archive
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-[2rem] border border-zinc-200 bg-white px-5 py-4 shadow-sm">
        <p className="text-sm text-zinc-500">Page {page} of {totalPages}</p>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => navigateToPage(page - 1)}>Previous</Button>
          <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => navigateToPage(page + 1)}>Next</Button>
        </div>
      </div>
    </div>
  );
}
