import { useCallback, useEffect, useMemo, useState } from 'react';
import { fetchCategories, fetchProducts } from '../utils/productApi.js';
import { useShopStore } from '../store/shopStore.js';

export default function useApiProducts() {
  const products = useShopStore((state) => state.products);
  const categories = useShopStore((state) => state.categories);
  const loading = useShopStore((state) => state.productsLoading);
  const error = useShopStore((state) => state.productsError);
  const setProductData = useShopStore((state) => state.setProductData);
  const setLoading = useShopStore((state) => state.setProductsLoading);
  const setError = useShopStore((state) => state.setProductsError);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  const loadProducts = useCallback(async (signal) => {
    setLoading(true);
    setError('');
    try {
      const [productData, categoryData] = await Promise.all([
        fetchProducts(20, signal), fetchCategories(signal),
      ]);
      if (!signal?.aborted) setProductData(productData, categoryData);
    } catch (err) {
      if (err.name !== 'AbortError') setError(err.message || 'Unable to load products.');
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, [setLoading, setError, setProductData]);

  useEffect(() => {
    const controller = new AbortController();
    loadProducts(controller.signal);
    return () => controller.abort();
  }, [loadProducts]);

  const filteredProducts = useMemo(() => products.filter((product) => {
    const query = search.trim().toLowerCase();
    const matchesSearch = product.title.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query);
    return matchesSearch && (category === 'all' || product.category === category);
  }), [products, search, category]);

  const reload = useCallback(() => loadProducts(), [loadProducts]);
  return { products: filteredProducts, categories, search, setSearch, category, setCategory, loading, error, reload };
}
