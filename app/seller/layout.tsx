import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { SellerHeader } from "@/components/layout/SellerHeader";
import { prisma } from "@/lib/prisma";

export default async function SellerLayout({ children }: { children: ReactNode }) {
  const session = await auth();

  if (!session?.user || !["SELLER", "ADMIN"].includes(session.user.role)) {
    redirect("/auth/login?callbackUrl=/seller");
  }

  const sellerProfile = await prisma.sellerProfile.findUnique({
    where: { userId: session.user.id },
  });

  return (
    <div className="min-h-screen bg-[#fffdf8] lg:flex">
      <SellerHeader storeName={sellerProfile?.storeName ?? session.user.name} />
      <div className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">{children}</div>
      </div>
    </div>
  );
}
