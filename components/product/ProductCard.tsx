"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Heart, Star } from "lucide-react";
import type { MouseEvent } from "react";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/toast";
import { calculateDiscount, cn, formatPrice } from "@/lib/utils";
import { useWishlistStore } from "@/store/wishlistStore";
import type { Product } from "@/types";

function getBadge(product: Product) {
  if (product.tags.some((tag) => tag.toLowerCase() === "new")) return { label: "New", variant: "new" as const };
  if (product.tags.some((tag) => tag.toLowerCase() === "bestseller")) return { label: "Bestseller", variant: "bestseller" as const };
  if (product.mrp > product.price) return { label: "Sale", variant: "sale" as const };
  if (product.isFeatured) return { label: "Limited", variant: "limited" as const };
  return null;
}

export function ProductCard({ product }: { product: Product }) {
  const router = useRouter();
  const { data: session } = useSession();
  const toggleItem = useWishlistStore((state) => state.toggleItem);
  const isWishlisted = useWishlistStore((state) => state.isWishlisted(product.id));
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] ?? "");
  const badge = getBadge(product);

  const rating = useMemo(() => product.averageRating ?? 0, [product.averageRating]);

  const handleWishlist = async (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    toggleItem(product.id);

    if (session?.user) {
      await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id }),
      }).catch(() => null);
    }

    toast({
      title: isWishlisted ? "Removed from wishlist" : "Saved to wishlist",
      description: product.name,
      variant: "success",
    });
  };

  return (
    <article
      onClick={() => router.push(`/sarees/${product.id}`)}
      className="group cursor-pointer overflow-hidden rounded-3xl border border-zinc-200 bg-white p-3 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
    >
      <div className="relative overflow-hidden rounded-2xl bg-cream">
        <div className="relative aspect-[3/4]">
          <Image
            src={product.images[0] || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80"}
            alt={product.name}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        </div>
        <button
          onClick={handleWishlist}
          className="absolute right-3 top-3 rounded-full bg-white/90 p-2 shadow-sm backdrop-blur transition hover:scale-105"
          aria-label="Toggle wishlist"
        >
          <Heart className={cn("h-4 w-4", isWishlisted ? "fill-accent text-accent" : "text-dark")} />
        </button>
        {badge ? (
          <div className="absolute left-3 top-3">
            <Badge variant={badge.variant}>{badge.label}</Badge>
          </div>
        ) : null}
        {product.sizes.length ? (
          <div className="absolute inset-x-3 bottom-3 hidden translate-y-4 rounded-2xl bg-white/92 p-3 opacity-0 shadow-lg backdrop-blur transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 lg:block">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">Quick sizes</p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.slice(0, 5).map((size) => (
                <button
                  key={size}
                  onClick={(event) => {
                    event.stopPropagation();
                    setSelectedSize(size);
                  }}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs font-medium transition",
                    selectedSize === size
                      ? "border-primary bg-primary text-white"
                      : "border-zinc-200 bg-white text-zinc-600 hover:border-primary/30",
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <div className="space-y-2 px-1 pb-1 pt-4">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-500">
          {product.seller?.storeName ?? "Sareeva"}
        </p>
        <h3 className="truncate text-sm font-medium text-dark">{product.name}</h3>
        <div className="flex items-center gap-1 text-xs text-zinc-500">
          <div className="flex items-center gap-0.5 rounded-full bg-emerald-50 px-2 py-1 text-emerald-700">
            <Star className="h-3.5 w-3.5 fill-current" />
            <span className="font-semibold">{rating.toFixed(1)}</span>
          </div>
          <span>({product.reviewCount ?? 0})</span>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="text-base font-bold text-dark">{formatPrice(product.price)}</span>
          <span className="text-zinc-400 line-through">{formatPrice(product.mrp)}</span>
          <span className="font-semibold text-orange-500">{calculateDiscount(product.mrp, product.price)}</span>
        </div>
      </div>
    </article>
  );
}
