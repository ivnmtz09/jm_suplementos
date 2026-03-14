// src/store/cartStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      // Agrega un producto. Si ya existe, suma +1 a la cantidad.
      addItem: (product) => {
        const { items } = get();
        const existing = items.find((i) => i.id === product.id);
        if (existing) {
          set({
            items: items.map((i) =>
              i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
            ),
          });
        } else {
          set({ items: [...items, { ...product, quantity: 1 }] });
        }
      },

      // Elimina un producto por id.
      removeItem: (productId) => {
        set({ items: get().items.filter((i) => i.id !== productId) });
      },

      // Actualiza la cantidad. Si llega a 0, elimina el item.
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.id === productId ? { ...i, quantity } : i
          ),
        });
      },

      // Vacía el carrito.
      clearCart: () => set({ items: [] }),
    }),
    {
      name: "jm-cart-storage", // clave en localStorage
    }
  )
);

// Selector del total ya calculado
export const selectTotal = (state) =>
  state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

// Selector del conteo total de unidades (para el badge)
export const selectItemCount = (state) =>
  state.items.reduce((sum, item) => sum + item.quantity, 0);

export default useCartStore;
