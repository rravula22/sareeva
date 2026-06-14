"use client";

import { ChevronDown, Filter, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const fabrics = ["Silk", "Cotton", "Georgette", "Chiffon", "Crepe", "Linen", "Banarasi"];
const occasions = ["Wedding", "Festive", "Casual", "Party", "Office", "Daily Wear"];
const colors = [
  { name: "Red", hex: "#C0392B" },
  { name: "Pink", hex: "#E91E63" },
  { name: "Gold", hex: "#C9952A" },
  { name: "Green", hex: "#2E7D32" },
  { name: "Blue", hex: "#1E88E5" },
  { name: "Black", hex: "#1A1A2E" },
];

function parseList(value: string | null) {
  return value ? value.split(",").filter(Boolean) : [];
}

export function ProductFilter() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

  const selectedFabrics = useMemo(() => parseList(searchParams.get("fabric")), [searchParams]);
  const selectedOccasions = useMemo(() => parseList(searchParams.get("occasion")), [searchParams]);
  const selectedColors = useMemo(() => parseList(searchParams.get("color")), [searchParams]);
  const minPrice = Number(searchParams.get("minPrice") ?? 499);
  const maxPrice = Number(searchParams.get("maxPrice") ?? 9999);
  const sort = searchParams.get("sort") ?? "featured";

  const updateParams = (changes: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(changes).forEach(([key, value]) => {
      if (!value) params.delete(key);
      else params.set(key, value);
    });
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  const toggleValue = (key: string, value: string, selectedValues: string[]) => {
    const next = selectedValues.includes(value)
      ? selectedValues.filter((item) => item !== value)
      : [...selectedValues, value];
    updateParams({ [key]: next.length ? next.join(",") : null });
  };

  const panel = (
    <div className="space-y-6 rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-dark">Filters</h3>
          <p className="mt-1 text-xs text-zinc-500">Fine-tune your saree shortlist.</p>
        </div>
        <Button variant="ghost" size="sm" onClick={() => router.push(pathname)}>
          Clear All
        </Button>
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-dark">Price range</h4>
          <span className="text-xs text-zinc-500">₹{minPrice} - ₹{maxPrice}</span>
        </div>
        <div className="space-y-3">
          <input
            type="range"
            min={499}
            max={12000}
            step={100}
            value={minPrice}
            onChange={(event) => updateParams({ minPrice: event.target.value })}
            className="w-full accent-primary"
          />
          <input
            type="range"
            min={999}
            max={20000}
            step={100}
            value={maxPrice}
            onChange={(event) => updateParams({ maxPrice: event.target.value })}
            className="w-full accent-primary"
          />
        </div>
      </section>

      <section className="space-y-3">
        <h4 className="text-sm font-semibold text-dark">Fabric</h4>
        <div className="space-y-2">
          {fabrics.map((fabric) => (
            <label key={fabric} className="flex cursor-pointer items-center gap-3 text-sm text-zinc-600">
              <input
                type="checkbox"
                checked={selectedFabrics.includes(fabric)}
                onChange={() => toggleValue("fabric", fabric, selectedFabrics)}
                className="h-4 w-4 rounded border-zinc-300 text-primary focus:ring-primary"
              />
              {fabric}
            </label>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h4 className="text-sm font-semibold text-dark">Occasion</h4>
        <div className="space-y-2">
          {occasions.map((occasion) => (
            <label key={occasion} className="flex cursor-pointer items-center gap-3 text-sm text-zinc-600">
              <input
                type="checkbox"
                checked={selectedOccasions.includes(occasion)}
                onChange={() => toggleValue("occasion", occasion, selectedOccasions)}
                className="h-4 w-4 rounded border-zinc-300 text-primary focus:ring-primary"
              />
              {occasion}
            </label>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h4 className="text-sm font-semibold text-dark">Colors</h4>
        <div className="flex flex-wrap gap-3">
          {colors.map((color) => {
            const active = selectedColors.includes(color.name);
            return (
              <button
                key={color.name}
                onClick={() => toggleValue("color", color.name, selectedColors)}
                className={cn(
                  "flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition",
                  active ? "border-primary bg-primary/5 text-primary" : "border-zinc-200 text-zinc-600",
                )}
              >
                <span className="h-4 w-4 rounded-full border border-white shadow" style={{ backgroundColor: color.hex }} />
                {color.name}
              </button>
            );
          })}
        </div>
      </section>

      <section className="space-y-3">
        <h4 className="text-sm font-semibold text-dark">Sort by</h4>
        <div className="relative">
          <select
            value={sort}
            onChange={(event) => updateParams({ sort: event.target.value })}
            className="h-11 w-full appearance-none rounded-2xl border border-zinc-200 bg-white px-4 text-sm outline-none focus:border-primary"
          >
            <option value="featured">Featured</option>
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="popular">Most Popular</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
        </div>
      </section>
    </div>
  );

  return (
    <>
      <div className="lg:hidden">
        <Button variant="outline" onClick={() => setOpen(true)}>
          <Filter className="h-4 w-4" />
          Filters & Sort
        </Button>
      </div>
      <div className="hidden lg:block">{panel}</div>
      <div className={`fixed inset-0 z-50 lg:hidden ${open ? "pointer-events-auto" : "pointer-events-none"}`}>
        <div className={`absolute inset-0 bg-dark/40 transition ${open ? "opacity-100" : "opacity-0"}`} onClick={() => setOpen(false)} />
        <div className={`absolute bottom-0 left-0 right-0 max-h-[88vh] overflow-y-auto rounded-t-[2rem] bg-white p-5 transition ${open ? "translate-y-0" : "translate-y-full"}`}>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-dark">Refine your picks</h3>
            <button onClick={() => setOpen(false)} className="rounded-full border border-zinc-200 p-2">
              <X className="h-4 w-4" />
            </button>
          </div>
          {panel}
        </div>
      </div>
    </>
  );
}
