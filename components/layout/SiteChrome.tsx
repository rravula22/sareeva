"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isSellerRoute = pathname.startsWith("/seller");

  if (isSellerRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
