import Link from "next/link";
import { Camera, MessagesSquare, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const footerLinks = {
  Shop: [
    { label: "All Sarees", href: "/sarees" },
    { label: "Silk", href: "/sarees?fabric=Silk" },
    { label: "Cotton", href: "/sarees?fabric=Cotton" },
    { label: "Designer", href: "/sarees?category=Designer" },
  ],
  Help: [
    { label: "Contact", href: "/contact" },
    { label: "Returns", href: "/returns" },
    { label: "Size Guide", href: "/sarees" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Press", href: "/press" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.4fr_repeat(3,1fr)] lg:px-8">
        <div className="space-y-5">
          <div>
            <p className="text-2xl font-extrabold tracking-[0.24em] text-primary">Sareeva</p>
            <p className="mt-3 max-w-sm text-sm leading-6 text-zinc-600">
              Thoughtfully curated sarees for celebrations, heirloom gifting, and everyday elegance.
            </p>
          </div>
          <div className="flex items-center gap-3 text-zinc-500">
            <a href="#" className="rounded-full border border-zinc-200 p-2 transition hover:border-primary hover:text-primary"><Camera className="h-4 w-4" /></a>
            <a href="#" className="rounded-full border border-zinc-200 p-2 transition hover:border-primary hover:text-primary"><MessagesSquare className="h-4 w-4" /></a>
            <a href="#" className="rounded-full border border-zinc-200 p-2 transition hover:border-primary hover:text-primary"><Send className="h-4 w-4" /></a>
          </div>
          <div className="rounded-3xl bg-cream p-5">
            <p className="text-sm font-semibold text-dark">Payments accepted</p>
            <p className="mt-2 text-sm text-zinc-500">Visa • Mastercard • UPI • Razorpay</p>
          </div>
        </div>

        {Object.entries(footerLinks).map(([title, links]) => (
          <div key={title}>
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-dark">{title}</h3>
            <ul className="mt-4 space-y-3 text-sm text-zinc-600">
              {links.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="transition hover:text-primary">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mx-auto grid max-w-7xl gap-6 border-t border-zinc-200 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_auto] lg:px-8">
        <div className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-dark">Newsletter</h3>
          <p className="text-sm text-zinc-600">Get new drops, festive edits, and members-only offers.</p>
          <div className="flex max-w-md flex-col gap-3 sm:flex-row">
            <Input type="email" placeholder="Enter your email" className="bg-cream" />
            <Button variant="accent">Subscribe</Button>
          </div>
        </div>
        <p className="self-end text-sm text-zinc-500">© {new Date().getFullYear()} Sareeva. All rights reserved.</p>
      </div>
    </footer>
  );
}
