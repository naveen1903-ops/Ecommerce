import { Link, useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { findFoodById } from './foods.js';
import { safeImageSource } from '../utils/safeInput.js';

export default function FoodDetailPage() {
  const { foodId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useOutletContext();
  const food = findFoodById(foodId);

  if (!food) {
    return <section className="state-message" aria-live="polite"><div><h2>Food item not found</h2><Link className="text-link" to="/food-demo">Back to food menu</Link></div></section>;
  }

  const imageSource = safeImageSource(food.image);
  return (
    <section className="food-detail" aria-labelledby="food-detail-heading">
      <Link className="text-link back-link" to="/food-demo">← Back to food menu</Link>
      <div className="food-detail-layout">
        {imageSource ? <img src={imageSource} alt={food.name} width="480" height="320" loading="eager" decoding="async" /> : null}
        <div>
          <p className="food-category">{food.category}</p>
          <h2 id="food-detail-heading">{food.name}</h2>
          <p>{food.description}</p>
          <p className="food-price">${food.price.toFixed(2)}</p>
          <div className="food-detail-actions">
            <button className="primary-button" type="button" onClick={() => { addToCart(food); navigate('/food-demo'); }}>Add to Cart</button>
            <Link className="secondary-button" to="/food-demo">Continue browsing</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
