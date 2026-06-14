"use client";

import Image from "next/image";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useMemo, useState } from "react";

import { toast } from "@/components/ui/toast";
import { formatPrice } from "@/lib/utils";

export interface SellerOrderItem {
  id: string;
  quantity: number;
  size?: string | null;
  price: number;
  product: {
    id: string;
    name: string;
    images: string[];
  };
}

export interface SellerOrder {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  customer: {
    name: string;
    email: string;
  };
  items: SellerOrderItem[];
}

const statuses = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"];

export function SellerOrdersManager({ orders }: { orders: SellerOrder[] }) {
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [expanded, setExpanded] = useState<string | null>(orders[0]?.id ?? null);

  const filteredOrders = useMemo(
    () => orders.filter((order) => selectedStatus === "ALL" || order.status === selectedStatus),
    [orders, selectedStatus],
  );

  const updateStatus = async (orderId: string, status: string) => {
    try {
      const response = await fetch("/api/seller/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to update order.");
      toast({ title: "Order updated", description: `Status changed to ${status}.`, variant: "success" });
      window.location.reload();
    } catch (error) {
      toast({ title: "Unable to update", description: error instanceof Error ? error.message : "Please try again.", variant: "error" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-zinc-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-dark">Manage orders</h2>
            <p className="text-sm text-zinc-500">Track fulfilment and update customer order status.</p>
          </div>
          <select
            value={selectedStatus}
            onChange={(event) => setSelectedStatus(event.target.value)}
            className="h-11 rounded-2xl border border-zinc-200 bg-cream px-4 text-sm outline-none focus:border-primary"
          >
            <option value="ALL">All statuses</option>
            {statuses.map((status) => <option key={status}>{status}</option>)}
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredOrders.map((order) => {
          const isOpen = expanded === order.id;
          return (
            <div key={order.id} className="overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-sm">
              <button
                onClick={() => setExpanded(isOpen ? null : order.id)}
                className="flex w-full flex-col gap-4 px-5 py-4 text-left sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Order #{order.id.slice(-8)}</p>
                  <p className="mt-1 text-lg font-semibold text-dark">{order.customer.name}</p>
                  <p className="text-sm text-zinc-500">{order.customer.email}</p>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Items</p>
                    <p className="font-semibold text-dark">{order.items.length}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Total</p>
                    <p className="font-semibold text-dark">{formatPrice(order.total)}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Date</p>
                    <p className="font-semibold text-dark">{new Date(order.createdAt).toLocaleDateString("en-IN")}</p>
                  </div>
                  {isOpen ? <ChevronUp className="h-5 w-5 text-zinc-400" /> : <ChevronDown className="h-5 w-5 text-zinc-400" />}
                </div>
              </button>
              {isOpen ? (
                <div className="border-t border-zinc-100 px-5 py-5">
                  <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-zinc-500">Update status for this order.</p>
                    <select
                      value={order.status}
                      onChange={(event) => updateStatus(order.id, event.target.value)}
                      className="h-10 rounded-2xl border border-zinc-200 bg-cream px-4 text-sm outline-none focus:border-primary"
                    >
                      {statuses.map((status) => <option key={status}>{status}</option>)}
                    </select>
                  </div>
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex flex-col gap-4 rounded-3xl bg-cream p-4 sm:flex-row sm:items-center">
                        <div className="relative h-24 w-20 overflow-hidden rounded-2xl bg-white">
                          <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" sizes="80px" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-dark">{item.product.name}</p>
                          <p className="mt-1 text-sm text-zinc-500">Qty {item.quantity}{item.size ? ` • ${item.size}` : ""}</p>
                        </div>
                        <p className="text-sm font-semibold text-dark">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
