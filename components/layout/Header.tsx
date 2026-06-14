"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  Heart,
  LogOut,
  Menu,
  Search,
  ShoppingBag,
  Store,
  User,
  UserCircle2,
  X,
} from "lucide-react";
import type { FormEvent } from "react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";

const navigation = [
  { href: "/", label: "Home" },
  { href: "/sarees", label: "Sarees" },
  { href: "/sarees?occasion=Wedding", label: "Occasions" },
  { href: "/about", label: "About" },
];

export function Header() {
  const router = useRouter();
  const { data: session } = useSession();
  const [query, setQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const cartItems = useCartStore((state) => state.items);
  const wishlistItems = useWishlistStore((state) => state.items);

  const cartCount = useMemo(
    () => cartItems.reduce((total, item) => total + item.quantity, 0),
    [cartItems],
  );

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    router.push(`/sarees${params.toString() ? `?${params.toString()}` : ""}`);
    setMobileOpen(false);
  };

  const renderUserLinks = () => {
    if (session?.user) {
      return (
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white text-dark transition hover:border-primary/30 hover:text-primary">
              <UserCircle2 className="h-5 w-5" />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              sideOffset={10}
              className="z-50 w-64 rounded-3xl border border-zinc-200 bg-white p-2 shadow-xl"
            >
              <div className="px-3 py-2">
                <p className="text-sm font-semibold text-dark">{session.user.name}</p>
                <p className="text-xs text-zinc-500">{session.user.email}</p>
              </div>
              <DropdownMenu.Separator className="my-2 h-px bg-zinc-100" />
              <DropdownMenu.Item asChild>
                <Link
                  href="/profile"
                  className="flex cursor-pointer items-center gap-2 rounded-2xl px-3 py-2 text-sm outline-none transition hover:bg-primary/5"
                >
                  <User className="h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenu.Item>
              {(session.user.role === "SELLER" || session.user.role === "ADMIN") && (
                <DropdownMenu.Item asChild>
                  <Link
                    href="/seller"
                    className="flex cursor-pointer items-center gap-2 rounded-2xl px-3 py-2 text-sm outline-none transition hover:bg-primary/5"
                  >
                    <Store className="h-4 w-4" />
                    Seller Dashboard
                  </Link>
                </DropdownMenu.Item>
              )}
              <DropdownMenu.Item
                onSelect={() => signOut({ callbackUrl: "/" })}
                className="flex cursor-pointer items-center gap-2 rounded-2xl px-3 py-2 text-sm text-rose-600 outline-none transition hover:bg-rose-50"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      );
    }

    return (
      <div className="hidden items-center gap-2 sm:flex">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/auth/login">Login</Link>
        </Button>
        <Button variant="accent" size="sm" asChild>
          <Link href="/auth/register">Register</Link>
        </Button>
      </div>
    );
  };

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-white/95 backdrop-blur">
      <div className="bg-gold px-4 py-2 text-center text-xs font-semibold uppercase tracking-[0.2em] text-white">
        Free shipping on orders above ₹999
      </div>
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <button
          onClick={() => setMobileOpen(true)}
          className="rounded-full border border-zinc-200 p-2 text-dark lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <Link href="/" className="text-2xl font-extrabold tracking-[0.24em] text-primary">
          Sareeva
        </Link>
        <form onSubmit={handleSearch} className="hidden flex-1 lg:block">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search silk, wedding, cotton sarees..."
              className="h-11 w-full rounded-full border border-zinc-200 bg-cream pl-11 pr-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
          </div>
        </form>
        <nav className="hidden items-center gap-6 text-sm font-medium text-dark lg:flex">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-primary">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => router.push("/sarees") }>
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link href="/wishlist" className="relative">
              <Heart className="h-5 w-5" />
              {wishlistItems.length ? (
                <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">
                  {wishlistItems.length}
                </span>
              ) : null}
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link href="/cart" className="relative">
              <ShoppingBag className="h-5 w-5" />
              {cartCount ? (
                <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              ) : null}
            </Link>
          </Button>
          {renderUserLinks()}
        </div>
      </div>

      <div className={`fixed inset-0 z-50 lg:hidden ${mobileOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
        <div
          className={`absolute inset-0 bg-dark/40 transition ${mobileOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setMobileOpen(false)}
        />
        <aside className={`absolute left-0 top-0 flex h-full w-[88%] max-w-sm flex-col bg-white p-6 shadow-2xl transition-transform ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-extrabold tracking-[0.24em] text-primary">
              Sareeva
            </Link>
            <button onClick={() => setMobileOpen(false)} className="rounded-full border border-zinc-200 p-2">
              <X className="h-5 w-5" />
            </button>
          </div>
          <form onSubmit={handleSearch} className="mt-6">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search sarees"
                className="h-11 w-full rounded-full border border-zinc-200 bg-cream pl-11 pr-4 text-sm outline-none focus:border-primary"
              />
            </div>
          </form>
          <nav className="mt-8 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="block rounded-2xl px-4 py-3 text-sm font-medium text-dark transition hover:bg-primary/5 hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto space-y-3 rounded-3xl bg-cream p-5">
            {session?.user ? (
              <>
                <p className="text-sm font-semibold text-dark">Signed in as {session.user.name}</p>
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" asChild>
                    <Link href="/profile" onClick={() => setMobileOpen(false)}>
                      Profile
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    className="flex-1"
                    onClick={() => signOut({ callbackUrl: "/" })}
                  >
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" asChild>
                  <Link href="/auth/login" onClick={() => setMobileOpen(false)}>
                    Login
                  </Link>
                </Button>
                <Button variant="accent" className="flex-1" asChild>
                  <Link href="/auth/register" onClick={() => setMobileOpen(false)}>
                    Register
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </aside>
      </div>
    </header>
  );
}
