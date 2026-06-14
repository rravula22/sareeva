import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Star } from "lucide-react";

import { ProductCard } from "@/components/product/ProductCard";
import { ProductDetailView } from "@/components/product/ProductDetailView";
import { getProductById, getProducts } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);
  return {
    title: product ? `${product.name} | Sareeva` : "Saree Details | Sareeva",
    description: product?.description?.slice(0, 140) ?? "Explore premium saree details on Sareeva.",
  };
}

export default async function SareeDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) notFound();

  const { products: similarProducts } = await getProducts({
    category: product.category,
    limit: 4,
    excludeId: product.id,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-wrap items-center gap-2 text-sm text-zinc-500">
        <Link href="/" className="transition hover:text-primary">Home</Link>
        <span>/</span>
        <Link href="/sarees" className="transition hover:text-primary">Sarees</Link>
        <span>/</span>
        <span className="text-dark">{product.name}</span>
      </div>

      <ProductDetailView product={product} />

      <section className="mt-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">You may also like</p>
            <h2 className="mt-2 text-3xl font-bold text-dark">Similar Sarees</h2>
          </div>
          <Link href="/sarees" className="text-sm font-semibold text-primary">View all</Link>
        </div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {similarProducts.map((similarProduct) => (
            <ProductCard key={similarProduct.id} product={similarProduct} />
          ))}
        </div>
      </section>

      <section className="mt-16 rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">Customer love</p>
            <h2 className="mt-2 text-3xl font-bold text-dark">Reviews & Ratings</h2>
          </div>
          <div className="rounded-3xl bg-cream px-5 py-4">
            <div className="flex items-center gap-2 text-primary">
              <Star className="h-5 w-5 fill-current" />
              <span className="text-2xl font-bold">{(product.averageRating ?? 0).toFixed(1)}</span>
            </div>
            <p className="mt-1 text-sm text-zinc-500">from {product.reviewCount ?? 0} reviews</p>
          </div>
        </div>
        <div className="mt-8 space-y-4">
          {product.reviews?.length ? (
            product.reviews.map((review) => (
              <div key={review.id} className="rounded-[1.5rem] bg-cream p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-dark">{review.user?.name ?? "Verified Buyer"}</p>
                    <p className="text-xs text-zinc-500">{new Date(review.createdAt).toLocaleDateString("en-IN")}</p>
                  </div>
                  <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
                    <Star className="h-4 w-4 fill-current" />
                    {review.rating}
                  </div>
                </div>
                {review.comment ? <p className="mt-3 text-sm leading-6 text-zinc-600">{review.comment}</p> : null}
              </div>
            ))
          ) : (
            <p className="text-sm text-zinc-500">Reviews will appear here once customers start sharing their experience.</p>
          )}
        </div>
      </section>
    </div>
  );
}
