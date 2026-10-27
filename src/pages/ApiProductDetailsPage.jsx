import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { fetchProductById } from '../utils/productApi.js';
import { useCart } from '../context/CartContext.jsx';
import { safeImageSource } from '../utils/safeInput.js';

export default function ApiProductDetailsPage() {
  const { id } = useParams();
  const { add } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const handleAdd = () => {
    if (!isAuthenticated) { navigate('/login', { state: { from: location } }); return; }
    if (product) add(product);
  };

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      setLoading(true); setError(''); setProduct(null);
      try { setProduct(await fetchProductById(id, controller.signal)); }
      catch (err) { if (err.name !== 'AbortError') setError(err.message || 'Unable to load product.'); }
      finally { if (!controller.signal.aborted) setLoading(false); }
    }
    load();
    return () => controller.abort();
  }, [id]);

  if (loading) return <main id="main-content" className="page-container"><div className="state-message" role="status" aria-live="polite"><span className="spinner" aria-hidden="true" /> Loading product details…</div></main>;
  if (error) return <main id="main-content" className="page-container"><div className="error-message" role="alert"><h1>Product details unavailable</h1><p>{error}</p><Link to="/api-products">Back to API Store</Link></div></main>;
  if (!product) return <main id="main-content" className="page-container"><div className="state-message">Product not found. <Link to="/api-products">Back to store</Link></div></main>;
  const imageSource = safeImageSource(product.image);
  return <main id="main-content" className="page-container"><Link className="text-link back-link" to="/api-products">← Back to API Store</Link><section className="detail-layout"><div className="detail-image">{imageSource ? <img src={imageSource} alt={product.title} width="480" height="320" loading="eager" decoding="async" /> : <p>Product image unavailable.</p>}</div><div className="detail-copy"><p className="eyebrow">{product.category}</p><h1>{product.title}</h1>{product.rating && <p className="rating">★ {product.rating.rate} <span>({product.rating.count} reviews)</span></p>}<p className="detail-price">{Number(product.price).toFixed(2)} <small>(API currency)</small></p><p>{product.description}</p><button className="primary-button" type="button" onClick={handleAdd}>{isAuthenticated ? 'Add to Cart' : 'Login to Add'}</button></div></section></main>;
}
