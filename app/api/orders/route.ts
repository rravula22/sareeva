import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

interface CheckoutPayloadItem {
  productId: string;
  quantity: number;
  size?: string | null;
}

interface OrderSourceItem {
  productId: string;
  quantity: number;
  size?: string | null;
  product: {
    price: number;
  };
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ orders });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { shippingAddress, paymentMethod, items: payloadItems } = await request.json();

    if (!shippingAddress) {
      return NextResponse.json({ error: "Shipping address is required." }, { status: 400 });
    }

    const cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    let items: OrderSourceItem[] =
      cart?.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        size: item.size,
        product: { price: item.product.price },
      })) ?? [];

    if (!items.length && Array.isArray(payloadItems) && payloadItems.length) {
      const typedPayloadItems = payloadItems as CheckoutPayloadItem[];
      const ids = typedPayloadItems.map((item) => item.productId);
      const products = await prisma.product.findMany({ where: { id: { in: ids } } });
      items = typedPayloadItems.map((item) => {
        const product = products.find((candidate) => candidate.id === item.productId);
        if (!product) {
          throw new Error(`Invalid product: ${item.productId}`);
        }
        return {
          productId: item.productId,
          quantity: Number(item.quantity),
          size: item.size ?? null,
          product: { price: product.price },
        };
      });
    }

    if (!items.length) {
      return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
    }

    const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const discount = subtotal > 3499 ? 250 : 0;
    const deliveryCharge = subtotal > 999 ? 0 : 99;
    const total = subtotal + deliveryCharge - discount;

    const order = await prisma.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({
        data: {
          userId: session.user.id,
          subtotal,
          discount,
          deliveryCharge,
          total,
          paymentMethod,
          shippingAddress,
          items: {
            create: items.map((item) => ({
              productId: item.productId,
              quantity: Number(item.quantity),
              size: item.size ?? null,
              price: item.product.price,
            })),
          },
        },
        include: {
          items: true,
        },
      });

      if (cart?.id) {
        await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
      }

      return createdOrder;
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create order." },
      { status: 500 },
    );
  }
}
