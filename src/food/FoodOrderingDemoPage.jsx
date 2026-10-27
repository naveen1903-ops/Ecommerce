import { useCallback, useMemo, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Cart from './Cart.jsx';
import { FOOD_ITEMS } from './foods.js';

export default function FoodOrderingDemoPage() {
  const [cartItems, setCartItems] = useState([]);
  const foodsById = useMemo(() => new Map(FOOD_ITEMS.map((food) => [food.id, food])), []);

  // Only accept item IDs from our trusted menu rather than trusting arbitrary UI data.
  const addToCart = useCallback((submittedFood) => {
    const food = foodsById.get(Number(submittedFood?.id));
    if (!food) return;
    setCartItems((current) => {
      const existing = current.find((item) => item.id === food.id);
      if (existing) {
        if (existing.quantity >= 99) return current;
        return current.map((item) => item.id === food.id ? { ...item, quantity: Math.min(99, item.quantity + 1) } : item);
      }
      return [...current, { ...food, quantity: 1 }];
    });
  }, [foodsById]);

  const removeFromCart = useCallback((id) => {
    const normalizedId = Number(id);
    if (!Number.isInteger(normalizedId)) return;
    setCartItems((current) => current.filter((item) => item.id !== normalizedId));
  }, []);

  const outletContext = useMemo(() => ({ foods: FOOD_ITEMS, addToCart }), [addToCart]);

  return (
    <main id="main-content" className="page-container food-demo-page">
      <p className="eyebrow">EXPERIMENT 10 · PERFORMANCE, ACCESSIBILITY & PWA</p>
      <h1>Food Ordering Demo</h1>
      <p>Search the sample menu, open a food detail page, and try the cart. Controls work with a keyboard: press Tab to move, Enter or Space to activate.</p>
      <Outlet context={outletContext} />
      <Cart items={cartItems} onRemoveFromCart={removeFromCart} />
    </main>
  );
}
