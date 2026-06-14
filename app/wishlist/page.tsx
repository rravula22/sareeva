"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";

import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import type { Product } from "@/types";

interface WishlistApiItem {
  productId: string;
}

export default function WishlistPage() {
  const { data: session } = useSession();
  const wishlistItems = useWishlistStore((state) => state.items);
  const setWishlistItems = useWishlistStore((state) => state.setItems);
  const toggleWishlist = useWishlistStore((state) => state.toggleItem);
  const addItem = useCartStore((state) => state.addItem);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (!session?.user) return;
    fetch("/api/wishlist")
      .then((response) => response.json())
      .then((result) => {
        if (result.items?.length) {
          setWishlistItems(result.items.map((item: WishlistApiItem) => item.productId));
        }
      })
      .catch(() => null);
  }, [session?.user, setWishlistItems]);

  useEffect(() => {
    let cancelled = false;

    const loadProducts = async () => {
      if (!wishlistItems.length) {
        if (!cancelled) {
          setProducts([]);
        }
        return;
      }

      try {
        const response = await fetch(`/api/products?ids=${wishlistItems.join(",")}`);
        const result = await response.json();
        if (!cancelled) {
          setProducts(result.products ?? []);
        }
      } catch {
        if (!cancelled) {
          setProducts([]);
        }
      }
    };

    void loadProducts();

    return () => {
      cancelled = true;
    };
  }, [wishlistItems]);

  const removeFromWishlist = async (product: Product) => {
    toggleWishlist(product.id);
    if (session?.user) {
      await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id }),
      }).catch(() => null);
    }
    toast({ title: "Removed from wishlist", description: product.name, variant: "success" });
  };

  const moveToCart = async (product: Product) => {
    addItem({
      productId: product.id,
      name: product.name,
      image: product.images[0],
      price: product.price,
      quantity: 1,
      size: product.sizes[0] ?? "Free Size",
    });
    await removeFromWishlist(product);
    toast({ title: "Moved to cart", description: product.name, variant: "success" });
  };

  if (!products.length) {
    return (
      <div className="mx-auto flex max-w-4xl flex-col items-center px-4 py-20 text-center sm:px-6 lg:px-8">
        <div className="rounded-full bg-primary/10 p-5 text-primary"><Heart className="h-8 w-8" /></div>
        <h1 className="mt-6 text-3xl font-bold text-dark">Your wishlist is waiting</h1>
        <p className="mt-3 text-sm text-zinc-500">Save the sarees you love and come back whenever you&apos;re ready.</p>
        <Button variant="accent" size="lg" className="mt-8" asChild>
          <Link href="/sarees">Browse Sarees</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">Saved styles</p>
          <h1 className="mt-2 text-3xl font-bold text-dark">Wishlist</h1>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {products.map((product) => (
          <div key={product.id} className="space-y-3">
            <ProductCard product={product} />
            <div className="grid gap-2 sm:grid-cols-2">
              <Button variant="accent" size="sm" onClick={() => moveToCart(product)}>Move to Cart</Button>
              <Button variant="outline" size="sm" onClick={() => removeFromWishlist(product)}>Remove</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
