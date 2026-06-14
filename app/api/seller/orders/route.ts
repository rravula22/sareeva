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

  const items = await prisma.orderItem.findMany({
    where: { product: { sellerId: sellerProfile.id } },
    include: {
      order: { include: { user: { select: { name: true, email: true } } } },
      product: true,
    },
    orderBy: { order: { createdAt: "desc" } },
  });

  return NextResponse.json({ items });
}

export async function PATCH(request: Request) {
  const session = await auth();
  if (!session?.user?.id || !isSellerRole(session.user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const sellerProfile = await getSellerProfileForUser(session.user.id);
    if (!sellerProfile) {
      return NextResponse.json({ error: "Seller profile not found." }, { status: 404 });
    }

    const { orderId, status } = await request.json();
    const hasOrder = await prisma.orderItem.findFirst({
      where: {
        orderId,
        product: {
          sellerId: sellerProfile.id,
        },
      },
    });

    if (!hasOrder) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });

    return NextResponse.json({ order });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to update order." },
      { status: 500 },
    );
  }
}
