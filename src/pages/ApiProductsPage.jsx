import useApiProducts from '../hooks/useApiProducts.js';
import ProductCard from '../components/ProductCard.jsx';
import { normalizeUserText } from '../utils/safeInput.js';
export default function ApiProductsPage() {
  const { products, categories, search, setSearch, category, setCategory, loading, error, reload } = useApiProducts();
  return <main id="main-content" className="page-container"><section className="page-heading"><div><p className="eyebrow">REST API · FETCH · ASYNC/AWAIT</p><h1>ShopEase API Store</h1><p>Browse products loaded from a public REST API.</p></div><button className="secondary-button" onClick={reload}>Refresh products</button></section>
    <section className="filters"><label htmlFor="product-search">Search products<input id="product-search" name="product-search" type="search" value={search} onChange={e => setSearch(normalizeUserText(e.target.value, 120))} placeholder="Search title or description…" maxLength={120} autoComplete="off" /></label><label htmlFor="product-category">Category<select id="product-category" name="product-category" value={category} onChange={e => setCategory(e.target.value)}><option value="all">All categories</option>{categories.map(item => <option key={item} value={item}>{item}</option>)}</select></label></section>
    {loading && <div className="state-message" role="status"><span className="spinner" aria-hidden="true" /> Loading products…</div>}
    {!loading && error && <div className="error-message" role="alert"><h2>Could not load products</h2><p>{error}</p><button className="primary-button" onClick={reload}>Try again</button></div>}
    {!loading && !error && products.length === 0 && <div className="state-message">No products found. Try another search or category.</div>}
    {!loading && !error && products.length > 0 && <><p className="results-count">Showing {products.length} matching products (maximum 20 fetched).</p><div className="product-grid">{products.map(product => <ProductCard key={product.id} product={product} />)}</div></>}
    <p className="api-note">Sample product data from Fake Store API. Prices are shown in the API's source currency, not converted to INR.</p>
  </main>;
}
