import { notFound } from "next/navigation";

import { auth } from "@/auth";
import { ProductForm } from "@/components/seller/ProductForm";
import { prisma } from "@/lib/prisma";
import type { Product } from "@/types";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  const sellerProfile = await prisma.sellerProfile.findUnique({ where: { userId: session!.user.id } });
  const product = await prisma.product.findFirst({ where: { id, sellerId: sellerProfile?.id } });

  if (!product) notFound();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">Edit listing</p>
        <h1 className="mt-2 text-3xl font-bold text-dark">Update Product</h1>
      </div>
      <ProductForm mode="edit" initialProduct={product as unknown as Partial<Product> & { id?: string }} />
    </div>
  );
}
