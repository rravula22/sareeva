import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { getSellerProfileForUser, isSellerRole } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id || !isSellerRole(session.user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sellerProfile = await getSellerProfileForUser(session.user.id);
  if (!sellerProfile) {
    return NextResponse.json({ error: "Seller profile not found." }, { status: 404 });
  }

  const [totalProducts, activeListings, orderItems] = await Promise.all([
    prisma.product.count({ where: { sellerId: sellerProfile.id } }),
    prisma.product.count({ where: { sellerId: sellerProfile.id, isActive: true } }),
    prisma.orderItem.findMany({
      where: { product: { sellerId: sellerProfile.id } },
      include: {
        order: true,
      },
    }),
  ]);

  const totalOrders = new Set(orderItems.map((item) => item.orderId)).size;
  const totalRevenue = orderItems
    .filter((item) => item.order.status !== "CANCELLED" && item.order.status !== "REFUNDED")
    .reduce((sum, item) => sum + item.price * item.quantity, 0);

  return NextResponse.json({ totalProducts, activeListings, totalOrders, totalRevenue });
}
