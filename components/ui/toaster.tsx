"use client";

import { ToastItemCard, ToastPrimitives, ToastViewport, useToast } from "@/components/ui/toast";

export function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <ToastPrimitives.Provider swipeDirection="right">
      {toasts.map((item) => (
        <ToastItemCard
          key={item.id}
          item={item}
          onOpenChange={(open) => {
            if (!open) dismiss(item.id);
          }}
        />
      ))}
      <ToastViewport />
    </ToastPrimitives.Provider>
  );
}
