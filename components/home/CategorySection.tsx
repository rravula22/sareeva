import Link from "next/link";

const categories = [
  { name: "Wedding Sarees", href: "/sarees?occasion=Wedding", gradient: "from-[#e6c885] to-[#c9952a]" },
  { name: "Silk Sarees", href: "/sarees?fabric=Silk", gradient: "from-[#5f2553] to-[#3b1837]" },
  { name: "Cotton Sarees", href: "/sarees?fabric=Cotton", gradient: "from-[#5c8d67] to-[#2f5f3b]" },
  { name: "Georgette", href: "/sarees?fabric=Georgette", gradient: "from-[#4f79c6] to-[#274a91]" },
  { name: "Designer", href: "/sarees?category=Designer", gradient: "from-[#7d2746] to-[#4a1128]" },
  { name: "Casual Wear", href: "/sarees?occasion=Casual", gradient: "from-[#ff7d8f] to-[#ff3f6c]" },
];

export function CategorySection({ title = "Shop by Occasion" }: { title?: string }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">Curated edits</p>
          <h2 className="mt-2 text-3xl font-bold text-dark">{title}</h2>
        </div>
        <Link href="/sarees" className="text-sm font-semibold text-primary transition hover:text-primary/80">
          View all
        </Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {categories.map((category) => (
          <Link
            key={category.name}
            href={category.href}
            className={`group relative overflow-hidden rounded-[2rem] bg-gradient-to-r ${category.gradient} p-6 text-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg`}
          >
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/15 blur-2xl transition group-hover:scale-125" />
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">Sareeva picks</p>
            <h3 className="mt-4 text-2xl font-bold">{category.name}</h3>
            <p className="mt-10 inline-flex items-center rounded-full border border-white/20 px-4 py-2 text-sm font-medium transition group-hover:bg-white/10">
              Shop Now
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
