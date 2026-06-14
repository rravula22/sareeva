"use client";

import * as React from "react";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { X } from "lucide-react";
import { create } from "zustand";

import { cn } from "@/lib/utils";

export type ToastVariant = "default" | "success" | "error";

export interface ToastPayload {
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

interface ToastItem extends ToastPayload {
  id: string;
}

interface ToastStore {
  toasts: ToastItem[];
  addToast: (payload: ToastPayload) => string;
  dismiss: (id: string) => void;
}

const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (payload) => {
    const id = crypto.randomUUID();
    set((state) => ({
      toasts: [...state.toasts, { id, duration: 3500, variant: "default", ...payload }],
    }));
    return id;
  },
  dismiss: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),
}));

export function toast(payload: ToastPayload) {
  return useToastStore.getState().addToast(payload);
}

export function useToast() {
  return {
    toast,
    toasts: useToastStore((state) => state.toasts),
    dismiss: useToastStore((state) => state.dismiss),
  };
}

const variantStyles: Record<ToastVariant, string> = {
  default: "border-zinc-200 bg-white text-dark",
  success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  error: "border-rose-200 bg-rose-50 text-rose-700",
};

export function ToastViewport() {
  return (
    <ToastPrimitives.Viewport className="fixed right-4 top-4 z-[120] flex w-[360px] max-w-[calc(100vw-2rem)] flex-col gap-3 outline-none" />
  );
}

export function ToastItemCard({
  item,
  onOpenChange,
}: {
  item: ToastItem;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <ToastPrimitives.Root
      open
      duration={item.duration}
      onOpenChange={onOpenChange}
      className={cn(
        "group relative overflow-hidden rounded-3xl border px-5 py-4 shadow-lg backdrop-blur",
        variantStyles[item.variant ?? "default"],
      )}
    >
      <div className="pr-6">
        {item.title ? <ToastPrimitives.Title className="text-sm font-semibold">{item.title}</ToastPrimitives.Title> : null}
        {item.description ? (
          <ToastPrimitives.Description className="mt-1 text-sm text-inherit/80">
            {item.description}
          </ToastPrimitives.Description>
        ) : null}
      </div>
      <ToastPrimitives.Close className="absolute right-3 top-3 rounded-full p-1 text-current/60 transition hover:bg-black/5 hover:text-current">
        <X className="h-4 w-4" />
      </ToastPrimitives.Close>
    </ToastPrimitives.Root>
  );
}

export { ToastPrimitives };
