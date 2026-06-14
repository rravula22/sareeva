import Link from "next/link";

import { ProductFilter } from "@/components/product/ProductFilter";
import { ProductCard } from "@/components/product/ProductCard";
import { getProducts } from "@/lib/data";

export const dynamic = "force-dynamic";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function SareesPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q : undefined;
  const fabric = typeof params.fabric === "string" ? params.fabric : undefined;
  const occasion = typeof params.occasion === "string" ? params.occasion : undefined;
  const color = typeof params.color === "string" ? params.color : undefined;
  const category = typeof params.category === "string" ? params.category : undefined;
  const sort = typeof params.sort === "string" ? params.sort : "featured";
  const page = Number(typeof params.page === "string" ? params.page : 1);
  const minPrice = Number(typeof params.minPrice === "string" ? params.minPrice : 0) || undefined;
  const maxPrice = Number(typeof params.maxPrice === "string" ? params.maxPrice : 0) || undefined;

  const { products, total, totalPages } = await getProducts({
    q,
    fabric,
    occasion,
    color,
    category,
    sort,
    page,
    limit: 12,
    minPrice,
    maxPrice,
  });

  const buildPageLink = (pageNumber: number) => {
    const next = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (typeof value === "string" && value) next.set(key, value);
    });
    next.set("page", String(pageNumber));
    return `/sarees?${next.toString()}`;
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-wrap items-center gap-2 text-sm text-zinc-500">
        <Link href="/" className="transition hover:text-primary">Home</Link>
        <span>/</span>
        <span className="text-dark">Sarees</span>
        {q ? <span className="rounded-full bg-primary/10 px-3 py-1 text-primary">Search: {q}</span> : null}
      </div>
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">Curated catalogue</p>
          <h1 className="mt-2 text-3xl font-bold text-dark">Sareeva Sarees</h1>
          <p className="mt-3 text-sm text-zinc-600">Showing {total} sarees tailored to your filters.</p>
        </div>
        <ProductFilter />
      </div>
      <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
        <aside className="hidden lg:block">
          <ProductFilter />
        </aside>
        <div>
          {products.length ? (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="rounded-[2rem] border border-dashed border-zinc-300 bg-white px-6 py-16 text-center shadow-sm">
              <h2 className="text-2xl font-semibold text-dark">No sarees found</h2>
              <p className="mt-3 text-sm text-zinc-500">Try adjusting your filters or browse our latest arrivals.</p>
              <Link href="/sarees" className="mt-6 inline-flex rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white">
                Clear filters
              </Link>
            </div>
          )}

          <div className="mt-10 flex items-center justify-between rounded-[2rem] border border-zinc-200 bg-white px-5 py-4 shadow-sm">
            <p className="text-sm text-zinc-500">Page {page} of {totalPages}</p>
            <div className="flex gap-3">
              <Link
                href={buildPageLink(Math.max(1, page - 1))}
                className={`rounded-full border px-4 py-2 text-sm font-medium ${page <= 1 ? "pointer-events-none border-zinc-100 text-zinc-300" : "border-zinc-200 text-zinc-600 hover:border-primary hover:text-primary"}`}
              >
                Previous
              </Link>
              <Link
                href={buildPageLink(Math.min(totalPages, page + 1))}
                className={`rounded-full border px-4 py-2 text-sm font-medium ${page >= totalPages ? "pointer-events-none border-zinc-100 text-zinc-300" : "border-zinc-200 text-zinc-600 hover:border-primary hover:text-primary"}`}
              >
                Next
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
