import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

async function getOrCreateCart(userId: string) {
  return prisma.cart.upsert({
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

  const cart = await prisma.cart.findUnique({
    where: { userId: session.user.id },
    include: {
      items: {
        include: {
          product: {
            include: {
              seller: {
                select: { storeName: true },
              },
            },
          },
        },
      },
    },
  });

  return NextResponse.json({ items: cart?.items ?? [] });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { productId, size, quantity = 1 } = await request.json();
    if (!productId) {
      return NextResponse.json({ error: "Product ID is required." }, { status: 400 });
    }

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product || !product.isActive) {
      return NextResponse.json({ error: "Product is unavailable." }, { status: 404 });
    }

    const cart = await getOrCreateCart(session.user.id);
    const existing = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId,
        size: size ?? null,
      },
    });

    const item = existing
      ? await prisma.cartItem.update({
          where: { id: existing.id },
          data: { quantity: existing.quantity + Number(quantity) },
        })
      : await prisma.cartItem.create({
          data: {
            cartId: cart.id,
            productId,
            quantity: Number(quantity),
            size: size ?? null,
          },
        });

    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to add to cart." },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { productId, size } = await request.json();
    const cart = await prisma.cart.findUnique({ where: { userId: session.user.id } });
    if (!cart) return NextResponse.json({ success: true });

    await prisma.cartItem.deleteMany({
      where: {
        cartId: cart.id,
        productId,
        size: size ?? null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to remove cart item." },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { productId, quantity, size } = await request.json();
    const cart = await prisma.cart.findUnique({ where: { userId: session.user.id } });
    if (!cart) return NextResponse.json({ error: "Cart not found." }, { status: 404 });

    const item = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId,
        size: size ?? null,
      },
    });

    if (!item) {
      return NextResponse.json({ error: "Cart item not found." }, { status: 404 });
    }

    if (Number(quantity) <= 0) {
      await prisma.cartItem.delete({ where: { id: item.id } });
      return NextResponse.json({ success: true });
    }

    const updated = await prisma.cartItem.update({
      where: { id: item.id },
      data: { quantity: Number(quantity) },
    });

    return NextResponse.json({ item: updated });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to update cart item." },
      { status: 500 },
    );
  }
}
