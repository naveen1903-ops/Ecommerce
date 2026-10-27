import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { normalizeUserText } from '../utils/safeInput.js';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  async function submit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (!username.trim() || username.trim().length > 80 || password.length > 128) {
        setError('Enter a username of at most 80 characters and a password of at most 128 characters.');
        return;
      }
      await login(normalizeUserText(username, 80), password);
      navigate(location.state?.from?.pathname || '/api-products', { replace: true });
    } catch (err) {
      const status = err.response?.status;
      setError(status === 401 || status === 403
        ? 'Invalid username or password. Check the demo credentials and try again.'
        : (err.message || 'Login failed. Check your connection and try again.'));
    } finally {
      setLoading(false);
    }
  }

  if (isAuthenticated) {
    return <main id="main-content" className="page-container narrow"><section className="message-card"><h1>You are logged in</h1><p>Your access token is saved in this browser.</p><Link className="primary-button inline-button" to="/cart">Open your cart</Link></section></main>;
  }

  return <main id="main-content" className="page-container narrow"><section className="form-card">
    <p className="eyebrow">EXPERIMENT 8 · API AUTHENTICATION</p>
    <h1>Login to ShopEase</h1>
    <p className="muted">The login form sends your credentials to the Fake Store API. A token is stored only after the API returns one.</p>
    <form onSubmit={submit}>
      <label htmlFor="login-username">Username<input id="login-username" name="username" autoComplete="username" value={username} onChange={(e) => setUsername(normalizeUserText(e.target.value, 80))} required maxLength={80} /></label>
      <label htmlFor="login-password">Password<input id="login-password" name="password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value.slice(0, 128))} required maxLength={128} /></label>
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="primary-button full-button" type="submit" disabled={loading}>{loading ? 'Authenticating…' : 'Login and get token'}</button>
    </form>
    <div className="auth-demo-note"><strong>Fake Store API test account</strong><br/>Username: <code>mor_2314</code><br/>Password: <code>83r5^_</code><p className="small">These are public sample credentials for this coursework API, not a personal account.</p></div>
    <p className="muted small">Login requires internet access. Do not use a real password on a demo API.</p>
    <Link to="/api-products">Continue browsing the API store</Link>
  </section></main>;
}
