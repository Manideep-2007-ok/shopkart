import { Link } from "react-router-dom";
import { formatDate, formatPrice } from "../utils";

export default function OrderCard({ order }) {
  return (
    <div className="order-card">
      <div className="order-head">
        <strong>Order #{order._id.slice(-8)}</strong>
        <span className={`badge ${order.status}`}>{order.status}</span>
      </div>
      <p className="muted">{formatDate(order.createdAt)}</p>
      {order.items.map((i) => (
        <p key={i.product}>{i.name} × {i.quantity}</p>
      ))}
      <p className="price">Total: {formatPrice(order.totalAmount)}</p>
      <Link className="btn btn-outline" to={`/orders/${order._id}`}>View Details</Link>
    </div>
  );
}
