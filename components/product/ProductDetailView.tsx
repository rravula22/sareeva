"use client";

import * as Accordion from "@radix-ui/react-accordion";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { Heart, MapPin, ShieldCheck, ShoppingBag, Star, Truck } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { calculateDiscount, cn, formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import type { Product, Review, SellerProfile } from "@/types";

interface DetailedProduct extends Product {
  seller?: (SellerProfile & { user?: { name?: string | null; email?: string | null } }) | null;
  reviews?: Review[];
}

export function ProductDetailView({ product }: { product: DetailedProduct }) {
  const { data: session } = useSession();
  const addItem = useCartStore((state) => state.addItem);
  const toggleWishlist = useWishlistStore((state) => state.toggleItem);
  const wishlisted = useWishlistStore((state) => state.isWishlisted(product.id));
  const [selectedImage, setSelectedImage] = useState(product.images[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] ?? "Free Size");
  const [pincode, setPincode] = useState("");
  const [checkingPincode, setCheckingPincode] = useState(false);

  const averageRating = useMemo(() => product.averageRating ?? 0, [product.averageRating]);

  const handleAddToCart = async () => {
    addItem({
      productId: product.id,
      name: product.name,
      image: product.images[0],
      price: product.price,
      quantity: 1,
      size: selectedSize,
    });

    if (session?.user) {
      await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, size: selectedSize, quantity: 1 }),
      }).catch(() => null);
    }

    toast({ title: "Added to bag", description: `${product.name} • ${selectedSize}`, variant: "success" });
  };

  const handleWishlist = async () => {
    toggleWishlist(product.id);
    if (session?.user) {
      await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id }),
      }).catch(() => null);
    }
    toast({
      title: wishlisted ? "Removed from wishlist" : "Added to wishlist",
      description: product.name,
      variant: "success",
    });
  };

  const checkDelivery = async () => {
    setCheckingPincode(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setCheckingPincode(false);
    toast({
      title: "Delivery available",
      description: `Estimated delivery to ${pincode || "your location"} in 3-5 business days.`,
      variant: "success",
    });
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="grid gap-4 lg:grid-cols-[100px_1fr]">
        <div className="order-2 flex gap-3 overflow-x-auto lg:order-1 lg:flex-col">
          {product.images.map((image) => (
            <button
              key={image}
              onClick={() => setSelectedImage(image)}
              className={cn(
                "relative h-24 w-20 shrink-0 overflow-hidden rounded-2xl border bg-white",
                selectedImage === image ? "border-primary" : "border-zinc-200",
              )}
            >
              <Image src={image} alt={product.name} fill className="object-cover" sizes="80px" />
            </button>
          ))}
        </div>
        <div className="order-1 overflow-hidden rounded-[2rem] border border-zinc-200 bg-white lg:order-2">
          <div className="relative aspect-[4/5] cursor-zoom-in bg-cream">
            <Image
              src={selectedImage}
              alt={product.name}
              fill
              className="object-cover transition duration-500 hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-500">{product.seller?.storeName ?? "Sareeva"}</p>
          <h1 className="mt-3 text-3xl font-bold text-dark">{product.name}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-zinc-500">
            <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1.5 text-emerald-700">
              <Star className="h-4 w-4 fill-current" />
              <span className="font-semibold">{averageRating.toFixed(1)}</span>
            </div>
            <span>{product.reviewCount ?? 0} verified reviews</span>
          </div>
        </div>

        <div className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-3xl font-bold text-dark">{formatPrice(product.price)}</span>
            <span className="text-lg text-zinc-400 line-through">{formatPrice(product.mrp)}</span>
            <span className="rounded-full bg-orange-50 px-3 py-1 text-sm font-semibold text-orange-500">
              {calculateDiscount(product.mrp, product.price)}
            </span>
          </div>
          <p className="mt-3 text-sm text-zinc-500">Inclusive of all taxes • Free shipping above ₹999</p>
        </div>

        <div className="space-y-4 rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-dark">Select size</h2>
            <button className="text-sm font-medium text-primary">Size Guide</button>
          </div>
          <div className="flex flex-wrap gap-3">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm font-medium transition",
                  selectedSize === size
                    ? "border-primary bg-primary text-white"
                    : "border-zinc-200 bg-white text-zinc-600 hover:border-primary/30",
                )}
              >
                {size}
              </button>
            ))}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Button variant="accent" size="lg" onClick={handleAddToCart}>
              <ShoppingBag className="h-4 w-4" />
              Add to Cart
            </Button>
            <Button variant="outline" size="lg" onClick={handleWishlist}>
              <Heart className={cn("h-4 w-4", wishlisted && "fill-accent text-accent")} />
              {wishlisted ? "Wishlisted" : "Add to Wishlist"}
            </Button>
          </div>
        </div>

        <div className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-dark">
            <MapPin className="h-4 w-4 text-primary" />
            Delivery details
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              value={pincode}
              onChange={(event) => setPincode(event.target.value)}
              placeholder="Enter pincode"
              className="bg-cream"
            />
            <Button variant="outline" onClick={checkDelivery} disabled={checkingPincode || !pincode}>
              {checkingPincode ? "Checking..." : "Check"}
            </Button>
          </div>
          <div className="mt-4 grid gap-3 text-sm text-zinc-600 sm:grid-cols-2">
            <div className="flex items-center gap-2 rounded-2xl bg-cream px-4 py-3"><Truck className="h-4 w-4 text-primary" /> Fast dispatch from verified sellers</div>
            <div className="flex items-center gap-2 rounded-2xl bg-cream px-4 py-3"><ShieldCheck className="h-4 w-4 text-primary" /> Authentic craftsmanship guaranteed</div>
          </div>
        </div>

        <Accordion.Root type="single" collapsible className="space-y-3">
          {[
            { label: "Product details", content: product.description },
            { label: "Fabric & occasion", content: `${product.fabric} • ${product.occasion.join(", ")}` },
            { label: "Care instructions", content: "Dry clean for the first wash. Store in a muslin bag away from direct sunlight to preserve sheen and weave." },
            { label: "Seller information", content: `${product.seller?.storeName ?? "Sareeva"}${product.seller?.user?.name ? ` • Managed by ${product.seller.user.name}` : ""}` },
          ].map((section) => (
            <Accordion.Item key={section.label} value={section.label} className="overflow-hidden rounded-[1.5rem] border border-zinc-200 bg-white">
              <Accordion.Trigger className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-semibold text-dark">
                {section.label}
              </Accordion.Trigger>
              <Accordion.Content className="px-5 pb-5 text-sm leading-6 text-zinc-600">
                {section.content}
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </div>
    </div>
  );
}
