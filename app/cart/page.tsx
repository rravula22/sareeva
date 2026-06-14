"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";

interface CartApiItem {
  productId: string;
  quantity: number;
  size?: string | null;
  product: {
    name: string;
    price: number;
    images: string[];
  };
}

export default function CartPage() {
  const { data: session } = useSession();
  const items = useCartStore((state) => state.items);
  const setItems = useCartStore((state) => state.setItems);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const total = useCartStore((state) => state.getTotal());

  useEffect(() => {
    if (!session?.user) return;
    fetch("/api/cart")
      .then((response) => response.json())
      .then((result) => {
        if (result.items?.length) {
          setItems(
            result.items.map((item: CartApiItem) => ({
              productId: item.productId,
              name: item.product.name,
              image: item.product.images[0],
              price: item.product.price,
              quantity: item.quantity,
              size: item.size ?? undefined,
            })),
          );
        }
      })
      .catch(() => null);
  }, [session?.user, setItems]);

  const delivery = total > 999 || total === 0 ? 0 : 99;
  const discount = total > 3499 ? 250 : 0;
  const grandTotal = total + delivery - discount;

  const syncQuantity = async (productId: string, quantity: number, size?: string) => {
    updateQuantity(productId, quantity, size);
    if (!session?.user) return;
    await fetch("/api/cart", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity, size }),
    }).catch(() => null);
  };

  const syncRemove = async (productId: string, size?: string) => {
    removeItem(productId, size);
    if (!session?.user) return;
    await fetch("/api/cart", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, size }),
    }).catch(() => null);
    toast({ title: "Item removed", variant: "success" });
  };

  if (!items.length) {
    return (
      <div className="mx-auto flex max-w-4xl flex-col items-center px-4 py-20 text-center sm:px-6 lg:px-8">
        <div className="rounded-full bg-primary/10 p-5 text-primary">
          <ShoppingBag className="h-8 w-8" />
        </div>
        <h1 className="mt-6 text-3xl font-bold text-dark">Your shopping bag is empty</h1>
        <p className="mt-3 text-sm text-zinc-500">Add a few favourites and come back to complete your Sareeva order.</p>
        <Button variant="accent" size="lg" className="mt-8" asChild>
          <Link href="/sarees">Browse Sarees</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">Secure checkout</p>
        <h1 className="mt-2 text-3xl font-bold text-dark">Your Cart</h1>
      </div>
      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-4">
          {items.map((item) => (
            <div key={`${item.productId}-${item.size}`} className="flex flex-col gap-4 rounded-[2rem] border border-zinc-200 bg-white p-5 shadow-sm sm:flex-row">
              <div className="relative h-36 w-28 overflow-hidden rounded-2xl bg-cream">
                <Image src={item.image} alt={item.name} fill className="object-cover" sizes="112px" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-dark">{item.name}</h2>
                <p className="mt-1 text-sm text-zinc-500">Size: {item.size || "Free Size"}</p>
                <p className="mt-3 text-lg font-bold text-dark">{formatPrice(item.price)}</p>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3 rounded-full border border-zinc-200 px-3 py-2">
                    <button onClick={() => syncQuantity(item.productId, item.quantity - 1, item.size)} className="text-zinc-500 transition hover:text-primary"><Minus className="h-4 w-4" /></button>
                    <span className="min-w-6 text-center text-sm font-semibold text-dark">{item.quantity}</span>
                    <button onClick={() => syncQuantity(item.productId, item.quantity + 1, item.size)} className="text-zinc-500 transition hover:text-primary"><Plus className="h-4 w-4" /></button>
                  </div>
                  <button onClick={() => syncRemove(item.productId, item.size)} className="inline-flex items-center gap-2 text-sm font-medium text-rose-600 transition hover:text-rose-700">
                    <Trash2 className="h-4 w-4" /> Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <aside className="space-y-4 rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm lg:sticky lg:top-28 lg:h-fit">
          <h2 className="text-xl font-semibold text-dark">Order Summary</h2>
          <div className="rounded-2xl bg-cream p-4">
            <Input placeholder="Apply coupon code" className="bg-white" />
          </div>
          <div className="space-y-3 text-sm text-zinc-600">
            <div className="flex items-center justify-between"><span>Subtotal</span><span>{formatPrice(total)}</span></div>
            <div className="flex items-center justify-between"><span>Delivery</span><span>{delivery === 0 ? "Free" : formatPrice(delivery)}</span></div>
            <div className="flex items-center justify-between text-emerald-700"><span>Discount</span><span>- {formatPrice(discount)}</span></div>
            <div className="border-t border-zinc-200 pt-3 text-base font-bold text-dark flex items-center justify-between"><span>Total</span><span>{formatPrice(grandTotal)}</span></div>
          </div>
          <Button variant="accent" size="lg" className="w-full" asChild>
            <Link href="/checkout">Place Order</Link>
          </Button>
        </aside>
      </div>
    </div>
  );
}
