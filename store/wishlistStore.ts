import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface WishlistStore {
  items: string[];
  toggleItem: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  clearWishlist: () => void;
  setItems: (items: string[]) => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      toggleItem: (productId) =>
        set((state) => ({
          items: state.items.includes(productId)
            ? state.items.filter((id) => id !== productId)
            : [...state.items, productId],
        })),
      isWishlisted: (productId) => get().items.includes(productId),
      clearWishlist: () => set({ items: [] }),
      setItems: (items) => set({ items }),
    }),
    {
      name: "sareeva-wishlist",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
