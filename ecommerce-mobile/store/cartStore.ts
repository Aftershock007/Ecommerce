import { create } from "zustand"

export const useCart = create((set) => ({
  items: [],
  totalQuantity: 0,
  addProducts: async (product, quantity: number) =>
    set((state) => {
      const existingProduct = state.items.find(
        (item) => item.product.id === product.id
      )
      if (existingProduct) {
        return {
          items: state.items.map((item) =>
            item.product.id === product.id ?
              { ...item, quantity: item.quantity + quantity }
            : item
          ),
          totalQuantity: state.totalQuantity + quantity
        }
      }
      return {
        items: [...state.items, { product, quantity: 1 }],
        totalQuantity: state.totalQuantity + quantity
      }
    }),
  resetCart: async () => set({ items: [], totalQuantity: 0 })
}))
