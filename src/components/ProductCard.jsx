import { memo, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { safeImageSource } from '../utils/safeInput.js';

function ProductCard({ product }) {
  const { add } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const handleAdd = useCallback(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location } });
      return;
    }
    add(product);
  }, [isAuthenticated, navigate, location, add, product]);
  const imageSource = safeImageSource(product.image);
  const detailPath = `/api-products/${encodeURIComponent(product.id)}`;

  return <article className="product-card">
    <Link to={detailPath} className="product-image-wrap" aria-label={`View ${product.title} details`}>
      {imageSource ? <img src={imageSource} alt={product.title} width="300" height="220" loading="lazy" decoding="async" /> : <span className="muted">Image unavailable</span>}
    </Link>
    <div className="product-card-body"><p className="category-label">{product.category}</p><h3><Link to={detailPath}>{product.title}</Link></h3>
      <p className="price">{Number(product.price).toFixed(2)} <small>(API currency)</small></p>
      {product.rating && <p className="rating">★ {product.rating.rate} <span>({product.rating.count} reviews)</span></p>}
      <button type="button" onClick={handleAdd} className="primary-button">{isAuthenticated ? 'Add to Cart' : 'Login to Add'}</button>
      <Link className="text-link" to={detailPath}>View details →</Link>
    </div>
  </article>;
}

export default memo(ProductCard);
