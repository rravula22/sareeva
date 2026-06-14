import { auth } from "@/auth";
import { SellerOrdersManager, type SellerOrder } from "@/components/seller/SellerOrdersManager";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function SellerOrdersPage() {
  const session = await auth();
  const sellerProfile = await prisma.sellerProfile.findUnique({ where: { userId: session!.user.id } });

  const orderItems = sellerProfile
    ? await prisma.orderItem.findMany({
        where: { product: { sellerId: sellerProfile.id } },
        include: {
          order: {
            include: {
              user: {
                select: {
                  name: true,
                  email: true,
                },
              },
            },
          },
          product: {
            select: {
              id: true,
              name: true,
              images: true,
            },
          },
        },
        orderBy: { order: { createdAt: "desc" } },
      })
    : [];

  const grouped = Array.from(
    orderItems.reduce((map, item) => {
      const current = map.get(item.order.id) ?? {
        id: item.order.id,
        total: item.order.total,
        status: item.order.status,
        createdAt: item.order.createdAt.toISOString(),
        customer: {
          name: item.order.user.name,
          email: item.order.user.email,
        },
        items: [],
      };
      current.items.push({
        id: item.id,
        quantity: item.quantity,
        size: item.size,
        price: item.price,
        product: item.product,
      });
      map.set(item.order.id, current);
      return map;
    }, new Map()),
  ).map(([, value]) => value);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">Fulfilment</p>
        <h1 className="mt-2 text-3xl font-bold text-dark">Seller Orders</h1>
      </div>
      <SellerOrdersManager orders={grouped as SellerOrder[]} />
    </div>
  );
}
