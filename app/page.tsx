import Link from "next/link";
import { BadgeCheck, CreditCard, RotateCcw, Truck } from "lucide-react";

import { CategorySection } from "@/components/home/CategorySection";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { HeroBanner } from "@/components/home/HeroBanner";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getProducts } from "@/lib/data";

export const dynamic = "force-dynamic";

const trustBadges = [
  { icon: Truck, title: "Free Shipping", description: "On orders above ₹999 across India." },
  { icon: RotateCcw, title: "Easy Returns", description: "Hassle-free return window on eligible styles." },
  { icon: BadgeCheck, title: "Authentic Products", description: "Verified sellers and quality-checked catalog." },
  { icon: CreditCard, title: "Secure Payment", description: "Trusted checkout with multiple payment options." },
];

export default async function HomePage() {
  const { products: newArrivals } = await getProducts({ limit: 4, sort: "newest" });

  return (
    <div className="pb-16">
      <HeroBanner />
      <CategorySection title="Shop by Occasion" />
      <FeaturedProducts title="Trending Sarees" description="Top-rated drapes making festive wardrobes feel effortless." />

      <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] bg-accent px-6 py-8 text-white shadow-sm sm:px-10">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/70">Limited time offer</p>
              <h2 className="mt-2 text-3xl font-bold">Flat 30% off on Silk Sarees</h2>
              <p className="mt-3 text-sm text-white/80">Use code <span className="font-bold text-white">SILK30</span> at checkout for your next festive look.</p>
            </div>
            <Button variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/15 hover:text-white" asChild>
              <Link href="/sarees?fabric=Silk">Shop Silk Sarees</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">Just in</p>
            <h2 className="mt-2 text-3xl font-bold text-dark">New Arrivals</h2>
          </div>
          <Link href="/sarees?sort=newest" className="text-sm font-semibold text-primary">View all</Link>
        </div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {trustBadges.map((badge) => {
            const Icon = badge.icon;
            return (
              <div key={badge.title} className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm">
                <div className="mb-4 inline-flex rounded-2xl bg-primary/10 p-3 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-dark">{badge.title}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-600">{badge.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-[2.5rem] border border-zinc-200 bg-white px-6 py-10 text-center shadow-sm sm:px-12">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">Join the Sareeva circle</p>
          <h2 className="mt-3 text-3xl font-bold text-dark">Get exclusive festive edits & early access</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-zinc-600">
            Sign up for styling notes, launch reminders, and special offers curated for saree lovers.
          </p>
          <div className="mx-auto mt-8 flex max-w-xl flex-col gap-3 sm:flex-row">
            <Input placeholder="Your email address" type="email" className="bg-cream" />
            <Button variant="accent" size="lg">Subscribe</Button>
          </div>
        </div>
      </section>
    </div>
  );
}
