import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { getSellerProfileForUser, isSellerRole } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

async function getOwnedProduct(productId: string, userId: string, role?: string) {
  if (role === "ADMIN") {
    return prisma.product.findUnique({ where: { id: productId } });
  }

  const sellerProfile = await getSellerProfileForUser(userId);
  if (!sellerProfile) return null;

  return prisma.product.findFirst({
    where: {
      id: productId,
      sellerId: sellerProfile.id,
    },
  });
}

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id || !isSellerRole(session.user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const product = await getOwnedProduct(id, session.user.id, session.user.role);
  if (!product) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }

  return NextResponse.json({ product });
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id || !isSellerRole(session.user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const existingProduct = await getOwnedProduct(id, session.user.id, session.user.role);
    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    const body = await request.json();
    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(body.name !== undefined ? { name: body.name } : {}),
        ...(body.description !== undefined ? { description: body.description } : {}),
        ...(body.price !== undefined ? { price: Number(body.price) } : {}),
        ...(body.mrp !== undefined ? { mrp: Number(body.mrp) } : {}),
        ...(body.images !== undefined ? { images: body.images } : {}),
        ...(body.fabric !== undefined ? { fabric: body.fabric } : {}),
        ...(body.occasion !== undefined ? { occasion: body.occasion } : {}),
        ...(body.color !== undefined ? { color: body.color } : {}),
        ...(body.sizes !== undefined ? { sizes: body.sizes } : {}),
        ...(body.stock !== undefined ? { stock: Number(body.stock) } : {}),
        ...(body.category !== undefined ? { category: body.category } : {}),
        ...(body.subcategory !== undefined ? { subcategory: body.subcategory || null } : {}),
        ...(body.tags !== undefined ? { tags: body.tags } : {}),
        ...(body.isFeatured !== undefined ? { isFeatured: Boolean(body.isFeatured) } : {}),
        ...(body.isActive !== undefined ? { isActive: Boolean(body.isActive) } : {}),
      },
    });

    return NextResponse.json({ product });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to update product." },
      { status: 500 },
    );
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id || !isSellerRole(session.user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const existingProduct = await getOwnedProduct(id, session.user.id, session.user.role);
    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    const product = await prisma.product.update({
      where: { id },
      data: { isActive: false },
    });

    return NextResponse.json({ product });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to archive product." },
      { status: 500 },
    );
  }
}
