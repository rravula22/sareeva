import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

async function getOrCreateWishlist(userId: string) {
  return prisma.wishlist.upsert({
    where: { userId },
    update: {},
    create: { userId },
  });
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const wishlist = await prisma.wishlist.findUnique({
    where: { userId: session.user.id },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  return NextResponse.json({ items: wishlist?.items ?? [] });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { productId } = await request.json();
    if (!productId) {
      return NextResponse.json({ error: "Product ID is required." }, { status: 400 });
    }

    const wishlist = await getOrCreateWishlist(session.user.id);
    const existing = await prisma.wishlistItem.findFirst({
      where: {
        wishlistId: wishlist.id,
        productId,
      },
    });

    if (existing) {
      await prisma.wishlistItem.delete({ where: { id: existing.id } });
      return NextResponse.json({ action: "removed" });
    }

    const item = await prisma.wishlistItem.create({
      data: {
        wishlistId: wishlist.id,
        productId,
      },
    });

    return NextResponse.json({ action: "added", item }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to update wishlist." },
      { status: 500 },
    );
  }
}
