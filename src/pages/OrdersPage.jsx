import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { readOrderHistory } from '../api/orderApi.js';

export default function OrdersPage() {
  const { user } = useAuth();
  const orders = readOrderHistory(user?.username);

  return <main className="page-container">
    <section className="page-heading"><div><p className="eyebrow">PROTECTED AREA · TOKEN REQUIRED</p><h1>My Orders</h1><p>Order history saved in this browser for {user?.username}.</p></div></section>
    <div className="crud-note"><strong>Demo limitation:</strong> Fake Store API returns simulated order responses and does not permanently save orders. ShopEase keeps this order history in local browser storage.</div>
    {!orders.length ? <section className="message-card"><h2>No orders yet</h2><p>Your confirmed demo orders will appear here.</p><Link className="primary-button inline-button" to="/api-products">Browse products</Link></section> : <div className="order-list">
      {orders.map((order) => <article className="order-card" key={order.localId}>
        <div className="order-card-header"><div><h2>Order #{order.localId}</h2><p className="muted small">{new Date(order.placedAt).toLocaleString()}</p></div><strong>{Number(order.total).toFixed(2)} API currency units</strong></div>
        <p><strong>Delivery name:</strong> {order.customerName}</p><p><strong>Address:</strong> {order.address}</p>
        <ul>{order.items.map((item) => <li key={`${order.localId}-${item.id}`}>{item.title} × {item.quantity}</li>)}</ul>
        <p className="muted small">Demo API response ID: {order.apiOrderId ?? 'not provided'}</p>
      </article>)}
    </div>}
  </main>;
}
