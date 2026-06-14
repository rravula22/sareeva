import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const sellerRoles = new Set(["SELLER", "ADMIN"]);

export function isSellerRole(role?: string | null) {
  return sellerRoles.has(role ?? "");
}

export async function getSessionUser() {
  const session = await auth();
  return session?.user ?? null;
}

export async function getSellerProfileForUser(userId: string) {
  return prisma.sellerProfile.findUnique({ where: { userId } });
}
