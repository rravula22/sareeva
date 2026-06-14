import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export interface ProductQueryOptions {
  q?: string;
  fabric?: string | string[];
  occasion?: string | string[];
  color?: string | string[];
  category?: string;
  featured?: boolean;
  sort?: string;
  page?: number;
  limit?: number;
  ids?: string[];
  sellerId?: string;
  minPrice?: number;
  maxPrice?: number;
  includeInactive?: boolean;
  excludeId?: string;
}

const productInclude = {
  seller: {
    select: {
      id: true,
      storeName: true,
      verified: true,
      logo: true,
      userId: true,
    },
  },
  reviews: {
    select: {
      rating: true,
    },
  },
} satisfies Prisma.ProductInclude;

type ProductWithRelations = Prisma.ProductGetPayload<{
  include: typeof productInclude;
}>;

const splitFilterValue = (value?: string | string[]) => {
  if (!value) return [];
  return (Array.isArray(value) ? value : value.split(","))
    .map((item) => item.trim())
    .filter(Boolean);
};

export function serializeProduct(product: ProductWithRelations) {
  const reviewCount = product.reviews.length;
  const averageRating = reviewCount
    ? Number(
        (
          product.reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviewCount
        ).toFixed(1),
      )
    : 0;

  return {
    ...product,
    averageRating,
    reviewCount,
  };
}

export async function getProducts(options: ProductQueryOptions = {}) {
  const page = Math.max(1, Number(options.page ?? 1));
  const limit = Math.min(24, Math.max(1, Number(options.limit ?? 8)));
  const fabrics = splitFilterValue(options.fabric);
  const occasions = splitFilterValue(options.occasion);
  const colors = splitFilterValue(options.color);
  const minPrice = typeof options.minPrice === "number" ? options.minPrice : undefined;
  const maxPrice = typeof options.maxPrice === "number" ? options.maxPrice : undefined;

  const andFilters: Prisma.ProductWhereInput[] = [];

  if (options.category) {
    andFilters.push({
      OR: [
        { category: { contains: options.category, mode: "insensitive" } },
        {
          subcategory: {
            contains: options.category,
            mode: "insensitive",
          },
        },
      ],
    });
  }

  if (options.q) {
    andFilters.push({
      OR: [
        { name: { contains: options.q, mode: "insensitive" } },
        { description: { contains: options.q, mode: "insensitive" } },
        { fabric: { contains: options.q, mode: "insensitive" } },
        { subcategory: { contains: options.q, mode: "insensitive" } },
      ],
    });
  }

  const where: Prisma.ProductWhereInput = {
    ...(options.includeInactive ? {} : { isActive: true }),
    ...(typeof options.featured === "boolean"
      ? { isFeatured: options.featured }
      : {}),
    ...(options.ids?.length ? { id: { in: options.ids } } : {}),
    ...(options.excludeId ? { id: { not: options.excludeId } } : {}),
    ...(options.sellerId ? { sellerId: options.sellerId } : {}),
    ...(fabrics.length ? { fabric: { in: fabrics } } : {}),
    ...(occasions.length ? { occasion: { hasSome: occasions } } : {}),
    ...(colors.length ? { color: { hasSome: colors } } : {}),
    ...(minPrice || maxPrice
      ? {
          price: {
            ...(typeof minPrice === "number" ? { gte: minPrice } : {}),
            ...(typeof maxPrice === "number" ? { lte: maxPrice } : {}),
          },
        }
      : {}),
    ...(andFilters.length ? { AND: andFilters } : {}),
  };

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    options.sort === "price-asc"
      ? { price: "asc" }
      : options.sort === "price-desc"
        ? { price: "desc" }
        : options.sort === "popular"
          ? { reviews: { _count: "desc" } }
          : options.sort === "newest"
            ? { createdAt: "desc" }
            : { isFeatured: "desc" };

  const [products, total] = await prisma.$transaction([
    prisma.product.findMany({
      where,
      include: productInclude,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products: products.map(serializeProduct),
    total,
    page,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
}

export async function getProductById(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      seller: {
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      },
      reviews: {
        include: {
          user: {
            select: {
              name: true,
              image: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!product) return null;

  const reviewCount = product.reviews.length;
  const averageRating = reviewCount
    ? Number(
        (
          product.reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviewCount
        ).toFixed(1),
      )
    : 0;

  return {
    ...product,
    averageRating,
    reviewCount,
  };
}
