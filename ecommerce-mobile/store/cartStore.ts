import { create } from "zustand"

export const useCart = create((set) => ({
  items: [],
  addProducts: (product: any) =>
    // TODO: if already in cart, increment quantity else add a new item
    set((state: any) => ({
      items: [...state.items, { product, quantity: 1 }]
    })),
  resetCart: () => set({ items: [] })
}))
