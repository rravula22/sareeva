import Link from "next/link";

import { ProductCard } from "@/components/product/ProductCard";
import { getProducts } from "@/lib/data";

interface FeaturedProductsProps {
  title?: string;
  description?: string;
  featured?: boolean;
  limit?: number;
  sort?: string;
}

export async function FeaturedProducts({
  title = "Featured Sarees",
  description = "Signature drapes loved for festive dressing and gifting.",
  featured = true,
  limit = 8,
  sort = "featured",
}: FeaturedProductsProps) {
  const { products } = await getProducts({ featured, limit, sort });

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">Editor&apos;s choice</p>
          <h2 className="mt-2 text-3xl font-bold text-dark">{title}</h2>
          <p className="mt-3 max-w-2xl text-sm text-zinc-600">{description}</p>
        </div>
        <Link href="/sarees" className="text-sm font-semibold text-primary transition hover:text-primary/80">
          View All
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
