import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface GuestCartItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  size?: string;
  quantity: number;
}

interface CartStore {
  items: GuestCartItem[];
  addItem: (item: GuestCartItem) => void;
  removeItem: (productId: string, size?: string) => void;
  updateQuantity: (productId: string, quantity: number, size?: string) => void;
  clearCart: () => void;
  setItems: (items: GuestCartItem[]) => void;
  getItemCount: () => number;
  getTotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const existing = state.items.find(
            (cartItem) =>
              cartItem.productId === item.productId && cartItem.size === item.size,
          );

          if (existing) {
            return {
              items: state.items.map((cartItem) =>
                cartItem.productId === item.productId &&
                cartItem.size === item.size
                  ? {
                      ...cartItem,
                      quantity: cartItem.quantity + item.quantity,
                    }
                  : cartItem,
              ),
            };
          }

          return { items: [...state.items, item] };
        }),
      removeItem: (productId, size) =>
        set((state) => ({
          items: state.items.filter(
            (item) => !(item.productId === productId && item.size === size),
          ),
        })),
      updateQuantity: (productId, quantity, size) =>
        set((state) => ({
          items: state.items
            .map((item) =>
              item.productId === productId && item.size === size
                ? { ...item, quantity: Math.max(1, quantity) }
                : item,
            )
            .filter((item) => item.quantity > 0),
        })),
      clearCart: () => set({ items: [] }),
      setItems: (items) => set({ items }),
      getItemCount: () =>
        get().items.reduce((count, item) => count + item.quantity, 0),
      getTotal: () =>
        get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0,
        ),
    }),
    {
      name: "sareeva-cart",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
