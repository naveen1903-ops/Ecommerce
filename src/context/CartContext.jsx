import { useShopStore } from '../store/shopStore.js';

// Compatibility adapter: existing Experiment 5 components can keep using useCart().
// Zustand is now the single global source of truth; this provider no longer owns state.
export function CartProvider({ children }) {
  return children;
}

export function useCart() {
  const items = useShopStore((state) => state.items);
  const add = useShopStore((state) => state.addToCart);
  const remove = useShopStore((state) => state.removeFromCart);
  const update = useShopStore((state) => state.updateQuantity);
  const clear = useShopStore((state) => state.clearCart);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  return { items, add, remove, update, clear, count };
}
