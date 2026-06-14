import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { SiteChrome } from "@/components/layout/SiteChrome";
import { Providers } from "@/components/providers";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Sareeva — Timeless Sarees Online",
  description: "Discover handcrafted sarees, bridal drapes, festive silks, and everyday classics online at Sareeva.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="flex min-h-screen flex-col bg-cream text-dark">
        <Providers>
          <SiteChrome>{children}</SiteChrome>
        </Providers>
      </body>
    </html>
  );
}
