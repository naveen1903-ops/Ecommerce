import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

const cartStore = (set, get) => ({
  // Global product state (populated by useApiProducts).
  products: [],
  categories: [],
  productsLoading: true,
  productsError: '',
  setProductData: (products, categories) => set(
    { products, categories, productsLoading: false, productsError: '' },
    false,
    'products/setProductData'
  ),
  setProductsLoading: (productsLoading) => set({ productsLoading }, false, 'products/setLoading'),
  setProductsError: (productsError) => set({ productsError, productsLoading: false }, false, 'products/setError'),
  addProductLocal: (product) => set({ products: [product, ...get().products] }, false, 'products/add'),
  updateProductLocal: (product) => set({ products: get().products.map((item) => item.id === product.id ? { ...item, ...product } : item) }, false, 'products/update'),
  deleteProductLocal: (id) => set({ products: get().products.filter((item) => item.id !== id) }, false, 'products/delete'),

  // Cart state.
  items: [],
  addToCart: (product) => {
    const items = get().items;
    const exists = items.some((item) => item.id === product.id);
    set({ items: exists
      ? items.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
      : [...items, { ...product, quantity: 1 }] }, false, 'cart/addToCart');
  },
  removeFromCart: (id) => set(
    { items: get().items.filter((item) => item.id !== id) },
    false,
    'cart/removeFromCart'
  ),
  updateQuantity: (id, quantity) => {
    if (!Number.isFinite(quantity) || quantity < 1) {
      get().removeFromCart(id);
      return;
    }
    set({ items: get().items.map((item) => item.id === id ? { ...item, quantity: Math.floor(quantity) } : item) }, false, 'cart/updateQuantity');
  },
  clearCart: () => set({ items: [] }, false, 'cart/clearCart'),
});

// devtools middleware labels every action for monitoring in Redux DevTools.
// persist stores only cart items; product/API loading state is refreshed from the API.
export const useShopStore = create(
  devtools(
    persist(cartStore, {
      name: 'shopease-experiment6-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
      version: 1,
    }),
    { name: 'ShopEaseStore' }
  )
);

// Shared selectors/calculations used by Cart and Checkout.
export function calculateCart(items) {
  const subtotal = items.reduce((sum, item) => sum + Number(item.price || 0) * item.quantity, 0);
  const discount = subtotal >= 100 ? subtotal * 0.10 : 0;
  const delivery = items.length > 0 ? 5 : 0;
  const finalAmount = Math.max(0, subtotal - discount + delivery);
  return { subtotal, discount, delivery, finalAmount };
}
