"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";

const steps = ["Delivery", "Review", "Payment"];

export default function CheckoutPage() {
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const total = useCartStore((state) => state.getTotal());
  const [step, setStep] = useState(0);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [successOrderId, setSuccessOrderId] = useState<string | null>(null);
  const [address, setAddress] = useState({
    name: "",
    phone: "",
    pincode: "",
    address: "",
    city: "",
    state: "",
  });

  const delivery = total > 999 || total === 0 ? 0 : 99;
  const discount = total > 3499 ? 250 : 0;
  const payable = total + delivery - discount;

  const handleSubmit = async () => {
    try {
      setPlacingOrder(true);
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shippingAddress: address,
          paymentMethod: "Demo Razorpay",
          items,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to place order.");
      setSuccessOrderId(result.order.id);
      clearCart();
      toast({ title: "Payment successful", description: `Order ${result.order.id} has been placed.`, variant: "success" });
    } catch (error) {
      toast({ title: "Checkout failed", description: error instanceof Error ? error.message : "Please try again.", variant: "error" });
    } finally {
      setPlacingOrder(false);
    }
  };

  if (successOrderId) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-20 text-center sm:px-6 lg:px-8">
        <div className="rounded-full bg-emerald-100 p-5 text-emerald-700">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h1 className="mt-6 text-3xl font-bold text-dark">Order placed successfully</h1>
        <p className="mt-3 text-sm text-zinc-500">Your order ID is <span className="font-semibold text-dark">{successOrderId}</span>. We&apos;ve sent a confirmation to your registered email.</p>
        <div className="mt-8 flex gap-3">
          <Button variant="accent" asChild>
            <Link href="/sarees">Continue Shopping</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/seller/orders">Track Orders</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-wrap gap-3">
        {steps.map((item, index) => (
          <div key={item} className={`rounded-full px-4 py-2 text-sm font-semibold ${step >= index ? "bg-primary text-white" : "bg-white text-zinc-500 border border-zinc-200"}`}>
            {index + 1}. {item}
          </div>
        ))}
      </div>
      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
          {step === 0 ? (
            <div className="space-y-5">
              <h1 className="text-2xl font-bold text-dark">Delivery Address</h1>
              <div className="grid gap-5 md:grid-cols-2">
                <Input label="Full name" value={address.name} onChange={(event) => setAddress({ ...address, name: event.target.value })} />
                <Input label="Phone number" value={address.phone} onChange={(event) => setAddress({ ...address, phone: event.target.value })} />
                <Input label="Pincode" value={address.pincode} onChange={(event) => setAddress({ ...address, pincode: event.target.value })} />
                <Input label="City" value={address.city} onChange={(event) => setAddress({ ...address, city: event.target.value })} />
                <Input label="State" value={address.state} onChange={(event) => setAddress({ ...address, state: event.target.value })} />
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-dark">Address</label>
                  <textarea value={address.address} onChange={(event) => setAddress({ ...address, address: event.target.value })} rows={4} className="w-full rounded-3xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10" />
                </div>
              </div>
            </div>
          ) : null}

          {step === 1 ? (
            <div className="space-y-5">
              <h1 className="text-2xl font-bold text-dark">Review Order</h1>
              <div className="rounded-[1.5rem] bg-cream p-5 text-sm text-zinc-600">
                <p className="font-semibold text-dark">Delivering to</p>
                <p className="mt-2 leading-6">{address.name}, {address.address}, {address.city}, {address.state} - {address.pincode}</p>
              </div>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={`${item.productId}-${item.size}`} className="flex items-center justify-between rounded-[1.5rem] border border-zinc-100 p-4">
                    <div>
                      <p className="font-semibold text-dark">{item.name}</p>
                      <p className="text-sm text-zinc-500">Qty {item.quantity} • {item.size || "Free Size"}</p>
                    </div>
                    <p className="font-semibold text-dark">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="space-y-5">
              <h1 className="text-2xl font-bold text-dark">Payment</h1>
              <div className="rounded-[1.5rem] bg-cream p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Demo checkout</p>
                <p className="mt-2 text-sm leading-6 text-zinc-600">Tap the button below to simulate a successful Razorpay payment flow for this demo storefront.</p>
              </div>
              <Button variant="accent" size="lg" className="w-full" onClick={handleSubmit} disabled={placingOrder}>
                {placingOrder ? "Processing..." : `Pay ${formatPrice(payable)}`}
              </Button>
            </div>
          ) : null}

          <div className="mt-8 flex justify-between">
            <Button variant="outline" disabled={step === 0} onClick={() => setStep((current) => current - 1)}>Back</Button>
            {step < 2 ? <Button variant="accent" onClick={() => setStep((current) => current + 1)}>Continue</Button> : null}
          </div>
        </div>

        <aside className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm lg:sticky lg:top-28 lg:h-fit">
          <h2 className="text-xl font-semibold text-dark">Order Summary</h2>
          <div className="mt-5 space-y-3 text-sm text-zinc-600">
            <div className="flex items-center justify-between"><span>Subtotal</span><span>{formatPrice(total)}</span></div>
            <div className="flex items-center justify-between"><span>Delivery</span><span>{delivery === 0 ? "Free" : formatPrice(delivery)}</span></div>
            <div className="flex items-center justify-between text-emerald-700"><span>Discount</span><span>- {formatPrice(discount)}</span></div>
            <div className="border-t border-zinc-200 pt-3 text-base font-bold text-dark flex items-center justify-between"><span>Payable</span><span>{formatPrice(payable)}</span></div>
          </div>
        </aside>
      </div>
    </div>
  );
}
