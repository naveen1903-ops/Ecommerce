import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const signOut = () => { logout(); navigate('/', { replace: true }); };

  return <header className="site-header"><Link className="brand" to="/">ShopEase</Link><nav>
    <Link to="/">Home</Link><Link to="/api-products">API Store</Link><Link to="/manage-products">Manage Products</Link>
    <Link to="/cart" title="Cart requires login">Cart ({count})</Link>
    {isAuthenticated && <Link to="/orders">My Orders</Link>}
    {isAuthenticated
      ? <><span className="welcome">Signed in: {user.username}</span><button className="nav-button" onClick={signOut}>Logout</button></>
      : <Link to="/login">Login</Link>}
  </nav></header>;
}
