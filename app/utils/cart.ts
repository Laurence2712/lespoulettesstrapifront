// app/utils/cart.ts
// Système de panier simple avec localStorage

export interface CartItem {
  id: number;
  title: string;
  prix: number;
  quantity: number;
  image_url?: string;
}

export const CartUtils = {
  // Récupérer le panier
  getCart: (): CartItem[] => {
    if (typeof window === 'undefined') return [];
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
  },

  // Ajouter au panier
  addToCart: (item: Omit<CartItem, 'quantity'>, quantity: number = 1) => {
    const cart = CartUtils.getCart();
    const existingItem = cart.find(i => i.id === item.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ ...item, quantity });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    return cart;
  },

  // Retirer du panier
  removeFromCart: (id: number) => {
    const cart = CartUtils.getCart().filter(item => item.id !== id);
    localStorage.setItem('cart', JSON.stringify(cart));
    return cart;
  },

  // Modifier la quantité
  updateQuantity: (id: number, quantity: number) => {
    const cart = CartUtils.getCart();
    const item = cart.find(i => i.id === id);
    if (item) {
      item.quantity = quantity;
      if (quantity <= 0) {
        return CartUtils.removeFromCart(id);
      }
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    return cart;
  },

  // Vider le panier
  clearCart: () => {
    localStorage.removeItem('cart');
    return [];
  },

  // Calculer le total
  getTotal: (cart: CartItem[]): number => {
    return cart.reduce((total, item) => total + (item.prix * item.quantity), 0);
  },

  // Compter les articles
  getItemCount: (cart: CartItem[]): number => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  }
};