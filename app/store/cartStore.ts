import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  id: number;
  title: string;
  prix: string | number;
  quantity: number;
  image_url: string;
  categorieId?: number;
  declinaisonId?: number;
}

interface CartState {
  items: CartItem[];
  lastActivity: number; // Timestamp de la dernière activité
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
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
      lastActivity: Date.now(),

      addToCart: (item) => {
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id);
          
          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
              ),
              lastActivity: Date.now(),
            };
          }
          
          return {
            items: [...state.items, item],
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
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
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
        
        if (now - lastActivity > EXPIRATION_TIME) {
          console.log('⏰ Panier expiré - Réinitialisation');
          get().clearCart();
        }
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);