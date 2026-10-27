import { normalizeUserText, safeImageSource } from './safeInput.js';

const API_BASE_URL = 'https://fakestoreapi.com';
const MAX_PRODUCTS = 20;

async function requestJson(url, options = {}) {
  let response;
  try {
    response = await fetch(url, {
      ...options,
      headers: { Accept: 'application/json', 'Content-Type': 'application/json', ...(options.headers || {}) },
    });
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    throw new Error('Network error. Check your internet connection and try again.');
  }
  if (!response.ok) {
    // Avoid copying arbitrary server response bodies into UI error messages.
    throw new Error(`Request failed (${response.status}). Please try again.`);
  }
  if (response.status === 204) return null;
  const contentType = response.headers?.get?.('content-type') || '';
  if (contentType && !contentType.toLowerCase().includes('json')) {
    throw new Error('The server returned an unexpected response format.');
  }
  try { return await response.json(); }
  catch { throw new Error('The server returned an invalid JSON response.'); }
}

function normalizeApiProduct(item) {
  if (!item || (typeof item.id !== 'number' && typeof item.id !== 'string')) return null;
  const id = Number(item.id);
  const price = Number(item.price);
  if (!Number.isInteger(id) || id < 1 || !Number.isFinite(price) || price < 0) return null;
  const title = normalizeUserText(item.title, 180);
  if (!title) return null;
  const image = safeImageSource(item.image);
  const description = normalizeUserText(item.description, 1200);
  const category = normalizeUserText(item.category, 80) || 'Uncategorized';
  const ratingRate = Number(item.rating?.rate);
  const ratingCount = Number(item.rating?.count);
  return {
    id,
    title,
    price,
    category,
    description,
    image,
    rating: Number.isFinite(ratingRate) && Number.isFinite(ratingCount)
      ? { rate: Math.max(0, Math.min(5, ratingRate)), count: Math.max(0, Math.floor(ratingCount)) }
      : null,
  };
}

function validateProductPayload(product) {
  const title = normalizeUserText(product?.title, 180);
  const description = normalizeUserText(product?.description, 1200);
  const category = normalizeUserText(product?.category, 80);
  const price = Number(product?.price);
  if (title.length < 2) throw new Error('Product title must contain at least 2 characters.');
  if (!Number.isFinite(price) || price < 0 || price > 1000000) throw new Error('Enter a valid non-negative product price.');
  if (!category) throw new Error('Select or enter a product category.');
  const image = safeImageSource(product?.image);
  if (product?.image && !image) throw new Error('Product image must be a local path or a valid HTTPS URL.');
  return { title, description, price, category, image };
}

function validateProductId(id) {
  const normalized = String(id ?? '').trim();
  if (!/^\d{1,10}$/.test(normalized) || Number(normalized) < 1) throw new Error('Invalid product ID.');
  return encodeURIComponent(normalized);
}

export async function fetchProducts(limit = MAX_PRODUCTS, signal) {
  const boundedLimit = Math.max(1, Math.min(MAX_PRODUCTS, Math.floor(Number(limit) || MAX_PRODUCTS)));
  const data = await requestJson(`${API_BASE_URL}/products?limit=${boundedLimit}`, { signal });
  if (!Array.isArray(data)) throw new Error('The products API returned an unexpected data format.');
  return data.map(normalizeApiProduct).filter(Boolean);
}

export async function fetchCategories(signal) {
  const data = await requestJson(`${API_BASE_URL}/products/categories`, { signal });
  if (!Array.isArray(data)) throw new Error('The categories API returned an unexpected data format.');
  return [...new Set(data.map((value) => normalizeUserText(value, 80)).filter(Boolean))].slice(0, 100);
}

export async function fetchProductById(id, signal) {
  const data = await requestJson(`${API_BASE_URL}/products/${validateProductId(id)}`, { signal });
  if (!data) return null;
  const product = normalizeApiProduct(data);
  if (!product) throw new Error('The product API returned invalid product data.');
  return product;
}

// Fake Store API simulates writes; its server does not permanently persist them.
export async function createProduct(product) {
  return requestJson(`${API_BASE_URL}/products`, { method: 'POST', body: JSON.stringify(validateProductPayload(product)) });
}
export async function updateProduct(id, product) {
  return requestJson(`${API_BASE_URL}/products/${validateProductId(id)}`, { method: 'PUT', body: JSON.stringify(validateProductPayload(product)) });
}
export async function deleteProduct(id) {
  return requestJson(`${API_BASE_URL}/products/${validateProductId(id)}`, { method: 'DELETE' });
}
