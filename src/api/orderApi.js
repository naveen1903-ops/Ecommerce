import apiClient, { ORDERS_KEY } from './axiosClient.js';

// The demo API accepts a cart-shaped order payload and returns a simulated ID.
// The API does not permanently store orders, so ShopEase also keeps a local history.
export async function submitOrder(orderPayload) {
  const response = await apiClient.post('/carts', orderPayload, { requiresAuth: true });
  return response.data;
}

export function readOrderHistory(username) {
  try {
    const allOrders = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
    if (!Array.isArray(allOrders)) return [];
    return allOrders.filter((order) => order.username === username);
  } catch {
    return [];
  }
}

export function saveOrderHistory(order) {
  try {
    const allOrders = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
    const current = Array.isArray(allOrders) ? allOrders : [];
    localStorage.setItem(ORDERS_KEY, JSON.stringify([order, ...current]));
  } catch {
    throw new Error('The order was accepted by the demo API, but local order history could not be saved. Check browser storage settings.');
  }
}
