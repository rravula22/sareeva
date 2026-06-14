import type { ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em]",
  {
    variants: {
      variant: {
        default: "bg-primary/10 text-primary",
        new: "bg-emerald-100 text-emerald-700",
        bestseller: "bg-gold/15 text-gold",
        sale: "bg-orange-100 text-orange-600",
        limited: "bg-rose-100 text-rose-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends VariantProps<typeof badgeVariants> {
  className?: string;
  children: ReactNode;
}

export function Badge({ className, variant, children }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)}>{children}</span>;
}
