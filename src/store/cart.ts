import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/types/product";

export type CartLine = {
  product: Product;
  quantity: number;
};

type CartState = {
  lines: CartLine[];
  add: (product: Product, quantity?: number) => void;
  remove: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
  subtotal: () => number;
  totalUnits: () => number;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      add: (product, quantity = product.moq) => {
        const qty = Math.max(quantity, product.moq);
        set((state) => {
          const existing = state.lines.find((l) => l.product.id === product.id);
          if (existing) {
            return {
              lines: state.lines.map((l) =>
                l.product.id === product.id
                  ? { ...l, quantity: l.quantity + qty }
                  : l,
              ),
            };
          }
          return { lines: [...state.lines, { product, quantity: qty }] };
        });
      },
      remove: (productId) =>
        set((state) => ({
          lines: state.lines.filter((l) => l.product.id !== productId),
        })),
      setQuantity: (productId, quantity) =>
        set((state) => ({
          lines: state.lines.map((l) =>
            l.product.id === productId
              ? {
                  ...l,
                  quantity: Math.max(quantity, l.product.moq),
                }
              : l,
          ),
        })),
      clear: () => set({ lines: [] }),
      subtotal: () =>
        get().lines.reduce(
          (sum, l) => sum + l.product.price_usd * l.quantity,
          0,
        ),
      totalUnits: () =>
        get().lines.reduce((sum, l) => sum + l.quantity, 0),
    }),
    { name: "beltforge-cart" },
  ),
);
