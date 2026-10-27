import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { calculateCart } from '../store/shopStore.js';
import { safeImageSource } from '../utils/safeInput.js';

export default function CartPage() {
  const { items, update, remove, clear } = useCart();
  const { subtotal, discount, delivery, finalAmount } = calculateCart(items);

  return <main id="main-content" className="page-container">
    <h1>Your Cart</h1>
    {items.length === 0 ? <section className="message-card" aria-live="polite">
      <p>Your cart is empty.</p>
      <Link className="primary-button inline-button" to="/api-products">Browse products</Link>
    </section> : <>
      <div className="cart-list" aria-label="Cart items">
        {items.map((item) => {
          const imageSource = safeImageSource(item.image);
          return <article className="cart-row" key={item.id}>
            {imageSource ? <img src={imageSource} alt="" width="88" height="88" loading="lazy" decoding="async" /> : <div className="cart-image-placeholder" aria-hidden="true" />}
            <div className="cart-item-info">
              <h2>{item.title}</h2>
              <p>{Number(item.price).toFixed(2)} API currency units each</p>
              <label htmlFor={`cart-quantity-${item.id}`}>Quantity
                <input id={`cart-quantity-${item.id}`} name={`cart-quantity-${item.id}`} type="number" min="1" max="99" step="1" value={item.quantity} onChange={(event) => update(item.id, Number(event.target.value))} />
              </label>
            </div>
            <button className="danger-button" type="button" aria-label={`Remove ${item.title} from cart`} onClick={() => remove(item.id)}>Remove</button>
          </article>;
        })}
      </div>
      <div className="cart-summary">
        <h2>Order Summary</h2>
        <p>Subtotal: {subtotal.toFixed(2)} API currency units</p>
        <p>Discount (10% when subtotal ≥ 100): −{discount.toFixed(2)}</p>
        <p>Delivery charge: {delivery.toFixed(2)}</p>
        <h2>Final amount: {finalAmount.toFixed(2)} API currency units</h2>
        <p>Prices are not converted to INR.</p>
        <button className="secondary-button" type="button" onClick={clear}>Clear cart</button>
      </div>
    </>}
  </main>;
}
