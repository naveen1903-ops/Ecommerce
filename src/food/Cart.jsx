import { memo, useMemo } from 'react';

/** Food cart uses semantic controls and polite live regions for assistive technology. */
function Cart({ items = [], onRemoveFromCart = () => {} }) {
  const total = useMemo(() => items.reduce((sum, item) => {
    const price = Number(item.price);
    const rawQuantity = Number(item.quantity) || 1;
    const quantity = Math.max(1, Math.min(99, Math.floor(rawQuantity)));
    return sum + (Number.isFinite(price) && price >= 0 ? price : 0) * quantity;
  }, 0), [items]);

  return (
    <section className="food-cart" aria-label="Shopping cart" aria-labelledby="food-cart-heading">
      <h2 id="food-cart-heading">Your Cart</h2>
      {items.length === 0 ? (
        <p role="status" aria-live="polite">Your cart is empty.</p>
      ) : (
        <>
          <ul aria-live="polite" aria-relevant="additions removals text">
            {items.map((item) => {
              const quantity = Math.max(1, Math.min(99, Math.floor(Number(item.quantity) || 1)));
              const price = Number(item.price);
              const safePrice = Number.isFinite(price) && price >= 0 ? price : 0;
              return (
                <li key={item.id}>
                  <span>{item.name} × {quantity}</span>
                  <span>${(safePrice * quantity).toFixed(2)}</span>
                  <button type="button" onClick={() => onRemoveFromCart(item.id)} aria-label={`Remove ${item.name} from cart`}>
                    Remove
                  </button>
                </li>
              );
            })}
          </ul>
          <p className="food-cart-total" aria-live="polite">Total: ${total.toFixed(2)}</p>
        </>
      )}
    </section>
  );
}

export default memo(Cart);
