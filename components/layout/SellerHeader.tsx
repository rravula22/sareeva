"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  LogOut,
  Package,
  PlusCircle,
  Settings,
  ShoppingCart,
  Store,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { href: "/seller", label: "Dashboard", icon: LayoutDashboard },
  { href: "/seller/products", label: "My Products", icon: Package },
  { href: "/seller/products/new", label: "Add Product", icon: PlusCircle },
  { href: "/seller/orders", label: "Orders", icon: ShoppingCart },
  { href: "/seller/settings", label: "Settings", icon: Settings },
];

export function SellerHeader({ storeName }: { storeName?: string | null }) {
  const pathname = usePathname();

  return (
    <>
      <aside className="hidden w-72 shrink-0 flex-col border-r border-primary/10 bg-dark px-6 py-8 text-white lg:flex">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <p className="text-xs uppercase tracking-[0.22em] text-white/60">Seller Hub</p>
          <h1 className="mt-2 text-2xl font-bold">{storeName || "Sareeva Store"}</h1>
          <p className="mt-2 text-sm text-white/70">Manage catalog, orders, and growth from one place.</p>
        </div>
        <nav className="mt-8 space-y-2">
          {links.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
                  active ? "bg-white text-primary" : "text-white/70 hover:bg-white/10 hover:text-white",
                )}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto flex flex-col gap-3 pt-8">
          <Button
            variant="outline"
            className="justify-start border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white"
            asChild
          >
            <Link href="/" target="_blank">
              <Store className="h-4 w-4" />
              View Store
            </Link>
          </Button>
          <Button
            variant="ghost"
            className="justify-start text-white hover:bg-white/10 hover:text-white"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>
      <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/95 backdrop-blur lg:hidden">
        <div className="space-y-4 px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">Seller Hub</p>
              <p className="text-lg font-semibold text-dark">{storeName || "Sareeva Store"}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => signOut({ callbackUrl: "/" })}>
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {links.map((link) => {
              const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm font-medium whitespace-nowrap transition",
                    active ? "border-primary bg-primary text-white" : "border-zinc-200 bg-white text-zinc-600",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      </header>
    </>
  );
}
