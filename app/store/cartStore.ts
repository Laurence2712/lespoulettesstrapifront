import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  id: string;
  title: string;
  prix: string | number;
  quantity: number;
  image_url: string;
  categorieId?: number | string;
  declinaisonId?: number;
  stock?: number;
}

interface CartState {
  items: CartItem[];
  lastActivity: number; // Timestamp de la dernière activité
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  checkExpiration: () => void;
}

const EXPIRATION_TIME = 24 * 60 * 60 * 1000; // 24 heures en millisecondes

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      lastActivity: 0,

      addToCart: (item) => {
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id);

          if (existingItem) {
            const maxStock = item.stock ?? existingItem.stock;
            const newQuantity = existingItem.quantity + item.quantity;
            const clampedQuantity = maxStock !== undefined ? Math.min(newQuantity, maxStock) : newQuantity;

            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, quantity: clampedQuantity, stock: maxStock } : i
              ),
              lastActivity: Date.now(),
            };
          }

          const clampedQuantity = item.stock !== undefined ? Math.min(item.quantity, item.stock) : item.quantity;

          return {
            items: [...state.items, { ...item, quantity: clampedQuantity }],
            lastActivity: Date.now(),
          };
        });
      },

      removeFromCart: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
          lastActivity: Date.now(),
        }));
      },

      updateQuantity: (id, quantity) => {
        if (quantity < 1) {
          get().removeFromCart(id);
          return;
        }

        set((state) => ({
          items: state.items.map((item) => {
            if (item.id !== id) return item;
            const clampedQuantity = item.stock !== undefined ? Math.min(quantity, item.stock) : quantity;
            return { ...item, quantity: clampedQuantity };
          }),
          lastActivity: Date.now(),
        }));
      },

      clearCart: () => {
        set({ items: [], lastActivity: Date.now() });
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => {
          return total + Number(item.prix) * item.quantity;
        }, 0);
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      checkExpiration: () => {
        const now = Date.now();
        const lastActivity = get().lastActivity;

        // Skip if store hasn't been hydrated from localStorage yet
        if (lastActivity === 0) return;

        if (now - lastActivity > EXPIRATION_TIME) {
          get().clearCart();
        }
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);