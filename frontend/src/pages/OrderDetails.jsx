import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getOrder } from "../services/api";
import { formatDate, formatPrice } from "../utils";

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getOrder(id)
      .then(({ data }) => setOrder(data.order))
      .catch((err) => setError(err.response?.status === 404 ? "Order not found." : "Unable to load order."));
  }, [id]);

  if (error) return <p className="state error">{error} <Link to="/orders">Back to orders</Link></p>;
  if (!order) return <p className="state">Loading order...</p>;

  const a = order.shippingAddress;
  return (
    <div className="order-card">
      <div className="order-head">
        <h1>Order #{order._id.slice(-8)}</h1>
        <span className={`badge ${order.status}`}>{order.status}</span>
      </div>
      <p className="muted">Placed on {formatDate(order.createdAt)} · Payment: {order.paymentStatus}</p>
      {order.items.map((i) => (
        <div className="row" key={i.product}>
          <span>{i.name} × {i.quantity} <small className="muted">(@ {formatPrice(i.price)})</small></span>
          <span>{formatPrice(i.price * i.quantity)}</span>
        </div>
      ))}
      <hr />
      <div className="row total"><span>Total</span><span>{formatPrice(order.totalAmount)}</span></div>
      <h3>Shipping to</h3>
      <p>{a.fullName} · {a.phone}<br />{a.addressLine1}, {a.city}, {a.state} - {a.pincode}</p>
      <Link to="/orders" className="btn btn-outline">← Back to orders</Link>
    </div>
  );
}
