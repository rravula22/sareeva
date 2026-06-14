export function ProductCardSkeleton() {
  return (
    <div className="animate-pulse rounded-3xl border border-zinc-200 bg-white p-3 shadow-sm">
      <div className="aspect-[3/4] rounded-2xl bg-zinc-100" />
      <div className="mt-4 space-y-3">
        <div className="h-3 w-20 rounded-full bg-zinc-100" />
        <div className="h-4 w-full rounded-full bg-zinc-100" />
        <div className="h-4 w-3/4 rounded-full bg-zinc-100" />
        <div className="h-5 w-1/2 rounded-full bg-zinc-100" />
      </div>
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <div className="h-10 w-64 animate-pulse rounded-full bg-zinc-100" />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        <div className="space-y-4 rounded-3xl border border-zinc-200 bg-white p-6">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="h-4 animate-pulse rounded-full bg-zinc-100" />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4 lg:col-span-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
