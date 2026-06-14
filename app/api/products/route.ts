import { NextResponse } from "next/server";

import { getProducts } from "@/lib/data";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const featuredValue = searchParams.get("featured");
    const result = await getProducts({
      q: searchParams.get("q") ?? undefined,
      fabric: searchParams.get("fabric") ?? undefined,
      occasion: searchParams.get("occasion") ?? undefined,
      color: searchParams.get("color") ?? undefined,
      category: searchParams.get("category") ?? undefined,
      featured: featuredValue === null ? undefined : featuredValue === "true",
      sort: searchParams.get("sort") ?? undefined,
      page: Number(searchParams.get("page") ?? 1),
      limit: Number(searchParams.get("limit") ?? 12),
      ids: searchParams.get("ids")?.split(",").filter(Boolean),
      minPrice: Number(searchParams.get("minPrice") ?? 0) || undefined,
      maxPrice: Number(searchParams.get("maxPrice") ?? 0) || undefined,
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to fetch products." },
      { status: 500 },
    );
  }
}
