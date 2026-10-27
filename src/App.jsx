import { lazy, Suspense } from 'react';
import { Link, Navigate, Route, Routes } from 'react-router-dom';
import Header from './components/Header.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';

// Route-level dynamic imports keep non-current pages out of the initial JS bundle.
const ApiProductsPage = lazy(() => import('./pages/ApiProductsPage.jsx'));
const ApiProductDetailsPage = lazy(() => import('./pages/ApiProductDetailsPage.jsx'));
const LoginPage = lazy(() => import('./pages/LoginPage.jsx'));
const CartPage = lazy(() => import('./pages/CartPage.jsx'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage.jsx'));
const ManageProductsPage = lazy(() => import('./pages/ManageProductsPage.jsx'));
const OrdersPage = lazy(() => import('./pages/OrdersPage.jsx'));
const FoodOrderingDemoPage = lazy(() => import('./food/FoodOrderingDemoPage.jsx'));
const FoodMenuPage = lazy(() => import('./food/FoodMenuPage.jsx'));
const FoodDetailPage = lazy(() => import('./food/FoodDetailPage.jsx'));

function PageLoading() {
  return <main className="page-container"><div className="state-message" role="status" aria-live="polite"><span className="spinner" aria-hidden="true" /> Loading page…</div></main>;
}

function HomePage() {
  return <main id="main-content" className="hero page-container">
    <p className="eyebrow">EXPERIMENTS 4–11</p>
    <h1>Shopping made simple.</h1>
    <p>ShopEase demonstrates API authentication, global cart state, product CRUD, component testing, code splitting, accessibility, and basic offline support.</p>
    <Link className="primary-button inline-button" to="/api-products">Explore API Store</Link>
    <Link className="secondary-button inline-button" to="/food-demo">Try Food Ordering Demo</Link>
    <div className="feature-grid">
      <article><span>01</span><h2>REST API + Zustand</h2><p>Fetch products and share cart state globally.</p></article>
      <article><span>02</span><h2>Smart filters</h2><p>Search by title and filter by category.</p></article>
      <article><span>03</span><h2>Performance + accessibility</h2><p>Lazy-loaded routes, keyboard-friendly controls, and an installable app shell.</p></article>
    </div>
  </main>;
}

export default function App() {
  return <AuthProvider><CartProvider><ErrorBoundary>
    <a className="skip-link" href="#main-content">Skip to main content</a>
    <Header />
    <Suspense fallback={<PageLoading />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/api-products" element={<ApiProductsPage />} />
        <Route path="/api-products/:id" element={<ApiProductDetailsPage />} />
        <Route path="/manage-products" element={<ManageProductsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
        <Route path="/food-demo" element={<FoodOrderingDemoPage />}>
          <Route index element={<FoodMenuPage />} />
          <Route path=":foodId" element={<FoodDetailPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
    <footer className="site-footer">ShopEase coursework demo · Experiments 5–11: APIs, authentication, testing, performance, accessibility, and PWA</footer>
  </ErrorBoundary></CartProvider></AuthProvider>;
}
