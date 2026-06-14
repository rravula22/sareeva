import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

const quickLinks = ["Wedding", "Silk", "Cotton", "Designer", "New Arrivals"];

export function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-primary via-[#66153c] to-dark text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(201,149,42,0.22),transparent_22%)]" />
      <div className="relative mx-auto grid min-h-[500px] max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-gold">Myntra-inspired festive edit</p>
          <h1 className="mt-4 text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
            Timeless Sarees, Modern Woman
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-white/80 sm:text-lg">
            Discover wedding silks, breezy cottons, and designer drapes curated for every celebration and every day in between.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button variant="accent" size="lg" asChild>
              <Link href="/sarees">
                Shop Now
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="border-white/30 bg-white/10 text-white hover:bg-white/15 hover:text-white" asChild>
              <Link href="/sarees?sort=featured">Explore Collections</Link>
            </Button>
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            {quickLinks.map((link) => (
              <Link
                key={link}
                href={`/sarees?category=${encodeURIComponent(link)}`}
                className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white/90 transition hover:border-white/40 hover:bg-white/15"
              >
                {link}
              </Link>
            ))}
          </div>
        </div>
        <div className="relative mx-auto hidden w-full max-w-xl lg:block">
          <div className="absolute -left-12 top-8 h-24 w-24 rounded-full bg-gold/40 blur-2xl" />
          <div className="absolute right-8 top-0 h-28 w-28 rounded-full bg-accent/30 blur-2xl" />
          <div className="relative mx-auto aspect-[4/5] max-w-md rounded-[2.5rem] border border-white/15 bg-white/10 p-6 shadow-2xl backdrop-blur">
            <div className="absolute left-6 top-6 h-[78%] w-[70%] rounded-[2.5rem_2.5rem_7rem_2rem] bg-gradient-to-b from-white/80 to-white/20" />
            <div className="absolute right-8 top-16 h-[70%] w-[38%] rounded-[3rem_1.5rem_3rem_3rem] bg-gradient-to-b from-gold/70 via-accent/30 to-transparent" />
            <div className="absolute inset-x-14 bottom-10 h-28 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute left-[35%] top-[18%] h-[56%] w-[32%] rounded-[45%_55%_40%_60%/55%_45%_55%_45%] bg-gradient-to-b from-primary/95 via-primary/75 to-dark/80 shadow-[0_20px_50px_rgba(26,26,46,0.35)]" />
            <div className="absolute left-[31%] top-[42%] h-[32%] w-[42%] rounded-[55%_45%_65%_35%/45%_55%_45%_55%] bg-gradient-to-r from-gold/80 to-accent/60 opacity-90" />
            <div className="absolute right-16 top-20 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
              Handpicked Drapes
            </div>
            <div className="absolute bottom-8 left-8 rounded-3xl bg-white/10 px-5 py-4 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.2em] text-white/60">Festive Launch</p>
              <p className="mt-1 text-xl font-semibold">Up to 40% Off</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
