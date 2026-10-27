import { memo } from 'react';
import { Link } from 'react-router-dom';
import { safeImageSource } from '../utils/safeInput.js';

/** Presentational card memoized so unrelated cart changes do not redraw every card. */
function FoodCard({ food, onAddToCart }) {
  const imageSource = safeImageSource(food.image);
  return (
    <article className="food-card" aria-label={`${food.name} food card`}>
      {imageSource ? <img
        className="food-image"
        src={imageSource}
        alt={`${food.name}`}
        width="480"
        height="260"
        loading="lazy"
        decoding="async"
      /> : null}
      <div className="food-card-content">
        <p className="food-category">{food.category}</p>
        <h3><Link className="food-title-link" to={`/food-demo/${food.id}`}>{food.name}</Link></h3>
        <p>{food.description}</p>
        <p className="food-price">${Number(food.price).toFixed(2)}</p>
        <button type="button" onClick={() => onAddToCart(food)} aria-label={`Add ${food.name} to cart`}>
          Add to Cart
        </button>
      </div>
    </article>
  );
}

export default memo(FoodCard);
