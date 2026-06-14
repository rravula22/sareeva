import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { getSellerProfileForUser, isSellerRole } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id || !isSellerRole(session.user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sellerProfile = await getSellerProfileForUser(session.user.id);
  if (!sellerProfile) {
    return NextResponse.json({ error: "Seller profile not found." }, { status: 404 });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") ?? undefined;
  const page = Number(searchParams.get("page") ?? 1);
  const take = Number(searchParams.get("limit") ?? 10);

  const where = {
    sellerId: sellerProfile.id,
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { fabric: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * take,
      take,
    }),
    prisma.product.count({ where }),
  ]);

  return NextResponse.json({ products, total, page, totalPages: Math.max(1, Math.ceil(total / take)) });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id || !isSellerRole(session.user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const sellerProfile = await getSellerProfileForUser(session.user.id);
    if (!sellerProfile) {
      return NextResponse.json({ error: "Seller profile not found." }, { status: 404 });
    }

    const product = await prisma.product.create({
      data: {
        name: body.name,
        description: body.description,
        price: Number(body.price),
        mrp: Number(body.mrp),
        images: body.images,
        fabric: body.fabric,
        occasion: body.occasion ?? [],
        color: body.color ?? [],
        sizes: body.sizes ?? [],
        stock: Number(body.stock ?? 0),
        category: body.category ?? "Saree",
        subcategory: body.subcategory || null,
        tags: body.tags ?? [],
        isFeatured: Boolean(body.isFeatured),
        sellerId: sellerProfile.id,
      },
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create product." },
      { status: 500 },
    );
  }
}
