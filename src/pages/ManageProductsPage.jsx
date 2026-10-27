import { useEffect, useState } from 'react';
import { createProduct, deleteProduct, fetchProducts, updateProduct } from '../utils/productApi.js';
import { useShopStore } from '../store/shopStore.js';

const blank = { title: '', price: '', description: '', category: "men's clothing", image: 'https://fakestoreapi.com/img/placeholder.png' };
export default function ManageProductsPage() {
  const products = useShopStore((s) => s.products);
  const setProductData = useShopStore((s) => s.setProductData);
  const addProductLocal = useShopStore((s) => s.addProductLocal);
  const updateProductLocal = useShopStore((s) => s.updateProductLocal);
  const deleteProductLocal = useShopStore((s) => s.deleteProductLocal);
  const [form, setForm] = useState(blank);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    if (products.length) return;
    let active = true;
    setInitialLoading(true);
    fetchProducts(20).then((items) => {
      if (active) setProductData(items, []);
    }).catch((err) => { if (active) setError(err.message || 'Unable to retrieve products.'); })
      .finally(() => { if (active) setInitialLoading(false); });
    return () => { active = false; };
  }, [products.length, setProductData]);

  const change = (event) => setForm({ ...form, [event.target.name]: event.target.value });
  const reset = () => { setForm(blank); setEditingId(null); };
  const submit = async (event) => {
    event.preventDefault(); setError(''); setNotice('');
    if (!form.title.trim() || !form.description.trim() || !form.category.trim() || !Number.isFinite(Number(form.price)) || Number(form.price) < 0) {
      setError('Enter a title, description, category, and a valid non-negative price.'); return;
    }
    const payload = { ...form, title: form.title.trim(), description: form.description.trim(), price: Number(form.price), image: form.image.trim() || blank.image };
    setLoading(true);
    try {
      if (editingId !== null) {
        const result = await updateProduct(editingId, payload);
        updateProductLocal({ ...payload, ...result, id: editingId });
        setNotice('Product updated successfully (demo API response).');
      } else {
        const result = await createProduct(payload);
        const newProduct = { ...payload, ...result, id: result?.id ?? Date.now(), rating: { rate: 0, count: 0 } };
        addProductLocal(newProduct);
        setNotice('Product created successfully (demo API response).');
      }
      reset();
    } catch (err) { setError(err.message || 'The product could not be saved.'); }
    finally { setLoading(false); }
  };

  const startEdit = (product) => {
    setEditingId(product.id);
    setForm({ title: product.title || '', price: String(product.price ?? ''), description: product.description || '', category: product.category || "men's clothing", image: product.image || '' });
    setError(''); setNotice(''); window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const remove = async (product) => {
    if (!window.confirm(`Delete “${product.title}”?`)) return;
    setLoading(true); setError(''); setNotice('');
    try {
      await deleteProduct(product.id);
      deleteProductLocal(product.id);
      setNotice('Product deleted successfully (demo API response).');
      if (editingId === product.id) reset();
    } catch (err) { setError(err.message || 'The product could not be deleted.'); }
    finally { setLoading(false); }
  };

  return <main className="page-container"><section className="page-heading"><div><p className="eyebrow">EXPERIMENT 7 · REST API · CRUD</p><h1>Manage Products</h1><p>Create, read, update, and delete products through API requests.</p></div></section>
    <div className="crud-note"><strong>Demo API limitation:</strong> Fake Store API simulates POST, PUT, and DELETE responses but does not permanently save changes on its server. Changes are reflected in this browser's current Zustand product state until products are fetched again.</div>
    {error && <div className="error-message" role="alert"><strong>Error</strong><p>{error}</p></div>}
    {notice && <div className="success-message" role="status">{notice}</div>}
    <section className="form-card crud-form-card"><h2>{editingId !== null ? `Edit product #${editingId}` : 'Add a new product'}</h2><form onSubmit={submit}>
      <label>Product title<input name="title" value={form.title} onChange={change} required maxLength={120} /></label>
      <label>Price<input name="price" type="number" min="0" step="0.01" value={form.price} onChange={change} required /></label>
      <label>Category<select name="category" value={form.category} onChange={change}><option>men's clothing</option><option>jewelery</option><option>electronics</option><option>women's clothing</option></select></label>
      <label>Image URL<input name="image" type="url" value={form.image} onChange={change} placeholder="https://example.com/image.jpg" /></label>
      <label className="crud-description">Description<textarea name="description" value={form.description} onChange={change} required rows="3" /></label>
      <div className="crud-actions"><button className="primary-button" disabled={loading}>{loading ? 'Saving…' : editingId !== null ? 'Save changes (PUT)' : 'Create product (POST)'}</button>{editingId !== null && <button type="button" className="secondary-button" onClick={reset} disabled={loading}>Cancel edit</button>}</div>
    </form></section>
    <section className="crud-list-section"><h2>Products (GET)</h2>{initialLoading && <div className="state-message" role="status"><span className="spinner"/> Loading products…</div>}{!initialLoading && products.length === 0 && <p className="state-message">No products available.</p>}
      <div className="crud-product-list">{products.map((product) => <article className="crud-product-row" key={product.id}><img src={product.image} alt="" loading="lazy"/><div className="crud-product-copy"><strong>{product.title}</strong><span>{product.category} · {Number(product.price).toFixed(2)} API currency units · ID {product.id}</span></div><button className="secondary-button" onClick={() => startEdit(product)} disabled={loading}>Edit</button><button className="danger-button" onClick={() => remove(product)} disabled={loading}>{loading ? 'Working…' : 'Delete'}</button></article>)}</div>
    </section>
  </main>;
}
