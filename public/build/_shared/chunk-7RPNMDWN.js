import {
  createHotContext
} from "/build/_shared/chunk-KR4X6VAU.js";

// app/utils/cart.ts
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/utils/cart.ts"
  );
  import.meta.hot.lastModified = "1761945721483.0112";
}
var CartUtils = {
  // Récupérer le panier
  getCart: () => {
    if (typeof window === "undefined")
      return [];
    const cart = localStorage.getItem("cart");
    return cart ? JSON.parse(cart) : [];
  },
  // Ajouter au panier
  addToCart: (item, quantity = 1) => {
    const cart = CartUtils.getCart();
    const existingItem = cart.find((i) => i.id === item.id);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ ...item, quantity });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    return cart;
  },
  // Retirer du panier
  removeFromCart: (id) => {
    const cart = CartUtils.getCart().filter((item) => item.id !== id);
    localStorage.setItem("cart", JSON.stringify(cart));
    return cart;
  },
  // Modifier la quantité
  updateQuantity: (id, quantity) => {
    const cart = CartUtils.getCart();
    const item = cart.find((i) => i.id === id);
    if (item) {
      item.quantity = quantity;
      if (quantity <= 0) {
        return CartUtils.removeFromCart(id);
      }
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    return cart;
  },
  // Vider le panier
  clearCart: () => {
    localStorage.removeItem("cart");
    return [];
  },
  // Calculer le total
  getTotal: (cart) => {
    return cart.reduce((total, item) => total + item.prix * item.quantity, 0);
  },
  // Compter les articles
  getItemCount: (cart) => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  }
};

export {
  CartUtils
};
//# sourceMappingURL=/build/_shared/chunk-7RPNMDWN.js.map
