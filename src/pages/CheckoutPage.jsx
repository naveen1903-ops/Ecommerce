import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { calculateCart } from '../store/shopStore.js';
import { saveOrderHistory, submitOrder } from '../api/orderApi.js';
import { normalizeUserText, validateCheckoutInput } from '../utils/safeInput.js';

export default function CheckoutPage() {
  const { items, clear } = useCart();
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const navigate = useNavigate();
  const { subtotal, discount, delivery, finalAmount } = calculateCart(items);

  async function submit(event) {
    event.preventDefault();
    if (!items.length || loading) return;
    const validated = validateCheckoutInput(name, address);
    if (!validated.valid) {
      setError(validated.message);
      return;
    }
    setError('');
    setLoading(true);
    const placedAt = new Date().toISOString();
    const localId = Date.now();
    try {
      const safeProducts = items.map((item) => ({
        productId: Number(item.id),
        quantity: Number(item.quantity),
      }));
      if (safeProducts.some((item) => !Number.isInteger(item.productId) || item.productId < 1 || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 99)) {
        throw new Error('Your cart contains an invalid item. Remove it and add the product again.');
      }
      // Only this explicitly protected request receives the saved Bearer token.
      const apiResult = await submitOrder({
        userId: 1,
        date: placedAt.slice(0, 10),
        products: safeProducts,
      });
      const order = {
        localId,
        apiOrderId: apiResult?.id ?? null,
        username: normalizeUserText(user?.username, 80),
        customerName: validated.name,
        address: validated.address,
        placedAt,
        items: items.map((item) => ({
          id: Number(item.id),
          title: normalizeUserText(item.title, 180),
          quantity: Number(item.quantity),
          price: Number(item.price),
        })),
        total: finalAmount,
      };
      saveOrderHistory(order);
      setConfirmedOrder(order);
      clear();
      setDone(true);
    } catch (err) {
      setError(err.message || 'Unable to place this demo order. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (done) return <main id="main-content" className="page-container"><section className="message-card"><p className="eyebrow">ORDER CREATED</p><h1>Order confirmed!</h1><p>Thanks, {confirmedOrder?.customerName}. Your order was submitted to the demo API and saved to this browser's order history.</p><p><strong>Order reference:</strong> {confirmedOrder?.localId}</p><div className="crud-actions"><button className="primary-button" type="button" onClick={() => navigate('/orders')}>View my orders</button><button className="secondary-button" type="button" onClick={() => navigate('/api-products')}>Continue shopping</button></div><p className="muted small">No real payment was taken. The demo API does not permanently store order data.</p></section></main>;

  return <main id="main-content" className="page-container narrow"><section className="form-card"><p className="eyebrow">PROTECTED CHECKOUT</p><h1>Checkout</h1>
    {error && <div className="error-message" role="alert" aria-live="assertive"><strong>Could not place order</strong><p>{error}</p>{/token|session|login/i.test(error) && <Link to="/login">Go to login</Link>}</div>}
    {!items.length ? <p>Your cart is empty. <Link to="/api-products">Browse products</Link></p> : <><div className="checkout-summary"><p>Subtotal: <span>{subtotal.toFixed(2)} API currency units</span></p><p>Discount: <span>−{discount.toFixed(2)}</span></p><p>Delivery: <span>{delivery.toFixed(2)}</span></p><h2>Final amount: {finalAmount.toFixed(2)} API currency units</h2><p className="muted small">Prices are not converted to INR. Demo checkout only.</p></div>
      <form onSubmit={submit} noValidate>
        <label htmlFor="checkout-name">Full name<input id="checkout-name" name="name" value={name} onChange={(e) => setName(normalizeUserText(e.target.value, 80))} required minLength={2} maxLength={80} autoComplete="name" aria-describedby="checkout-name-help" /></label>
        <p id="checkout-name-help" className="muted small field-help">Enter 2–80 characters.</p>
        <label htmlFor="checkout-address">Delivery address<textarea id="checkout-address" name="address" value={address} onChange={(e) => setAddress(normalizeUserText(e.target.value, 240))} required minLength={8} maxLength={240} autoComplete="street-address" rows="3" aria-describedby="checkout-address-help" /></label>
        <p id="checkout-address-help" className="muted small field-help">Enter 8–240 characters. Do not include payment card details.</p>
        <button className="primary-button full-button" type="submit" disabled={loading}>{loading ? 'Submitting order…' : 'Place demo order (token required)'}</button>
      </form>
    </>}
  </section></main>;
}
