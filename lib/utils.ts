import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...classes: ClassValue[]) {
  return twMerge(clsx(classes));
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

export function calculateDiscount(mrp: number, price: number) {
  if (!mrp || mrp <= price) return "0% off";
  const percentage = Math.round(((mrp - price) / mrp) * 100);
  return `${percentage}% off`;
}
