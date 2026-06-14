import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function SellerDashboardPage() {
  const session = await auth();
  const sellerProfile = await prisma.sellerProfile.findUnique({ where: { userId: session!.user.id } });

  const sellerId = sellerProfile?.id;
  const [totalProducts, activeListings, orderItems] = sellerId
    ? await Promise.all([
        prisma.product.count({ where: { sellerId } }),
        prisma.product.count({ where: { sellerId, isActive: true } }),
        prisma.orderItem.findMany({
          where: { product: { sellerId } },
          include: {
            order: { include: { user: { select: { name: true, email: true } } } },
            product: { select: { name: true } },
          },
          orderBy: { order: { createdAt: "desc" } },
          take: 10,
        }),
      ])
    : [0, 0, []];

  const recentOrders = Array.from(
    new Map(orderItems.map((item) => [item.order.id, item])).values(),
  ).slice(0, 5);
  const totalOrders = new Set(orderItems.map((item) => item.orderId)).size;
  const totalRevenue = orderItems
    .filter((item) => item.order.status !== "CANCELLED" && item.order.status !== "REFUNDED")
    .reduce((sum, item) => sum + item.price * item.quantity, 0);

  const checklist = [
    { label: "Complete your store profile", done: Boolean(sellerProfile?.description) },
    { label: "Upload at least 3 product listings", done: totalProducts >= 3 },
    { label: "Feature your best-seller", done: false },
    { label: "Review recent customer orders", done: totalOrders > 0 },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">Seller Dashboard</p>
          <h1 className="mt-2 text-3xl font-bold text-dark">Welcome back, {sellerProfile?.storeName ?? session?.user.name}</h1>
          <p className="mt-3 text-sm text-zinc-600">Monitor listings, orders, and revenue performance at a glance.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" asChild><Link href="/seller/orders">View Orders</Link></Button>
          <Button variant="accent" asChild><Link href="/seller/products/new">Add Product</Link></Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total Products", value: totalProducts },
          { label: "Active Listings", value: activeListings },
          { label: "Total Orders", value: totalOrders },
          { label: "Revenue", value: formatPrice(totalRevenue) },
        ].map((stat) => (
          <Card key={stat.label} className="rounded-[2rem]">
            <CardHeader>
              <p className="text-sm text-zinc-500">{stat.label}</p>
              <CardTitle className="text-3xl">{stat.value}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="rounded-[2rem]">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="text-left text-xs uppercase tracking-[0.18em] text-zinc-500">
                  <tr>
                    <th className="pb-3">Order</th>
                    <th className="pb-3">Customer</th>
                    <th className="pb-3">Item</th>
                    <th className="pb-3">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {recentOrders.map((item) => (
                    <tr key={item.id}>
                      <td className="py-4 font-semibold text-dark">#{item.order.id.slice(-8)}</td>
                      <td className="py-4 text-zinc-600">{item.order.user.name}</td>
                      <td className="py-4 text-zinc-600">{item.product.name}</td>
                      <td className="py-4 font-semibold text-dark">{formatPrice(item.price * item.quantity)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[2rem]">
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {checklist.map((item) => (
              <div key={item.label} className="flex items-center justify-between rounded-2xl bg-cream px-4 py-3 text-sm">
                <span className="text-dark">{item.label}</span>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${item.done ? "bg-emerald-100 text-emerald-700" : "bg-zinc-100 text-zinc-600"}`}>
                  {item.done ? "Done" : "Pending"}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
