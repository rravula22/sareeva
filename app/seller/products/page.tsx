import { auth } from "@/auth";
import { SellerProductsTable } from "@/components/seller/SellerProductsTable";
import { prisma } from "@/lib/prisma";
import type { Product } from "@/types";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export const dynamic = "force-dynamic";

export default async function SellerProductsPage({ searchParams }: { searchParams: SearchParams }) {
  const session = await auth();
  const params = await searchParams;
  const search = typeof params.search === "string" ? params.search : "";
  const page = Number(typeof params.page === "string" ? params.page : 1);
  const take = 10;
  const sellerProfile = await prisma.sellerProfile.findUnique({ where: { userId: session!.user.id } });

  const where = {
    sellerId: sellerProfile?.id,
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

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">Catalog</p>
        <h1 className="mt-2 text-3xl font-bold text-dark">My Products</h1>
      </div>
      <SellerProductsTable products={products as unknown as Product[]} page={page} totalPages={Math.max(1, Math.ceil(total / take))} search={search} />
    </div>
  );
}
