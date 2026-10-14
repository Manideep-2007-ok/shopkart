import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Icon from "../components/Icon";
import { getOrder } from "../services/api";
import { formatPrice } from "../utils";

export default function OrderSuccess() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    getOrder(id).then(({ data }) => setOrder(data.order)).catch(() => setError(true));
  }, [id]);

  if (error) return <p className="state error">Could not load order.</p>;
  if (!order) return <p className="state">Loading...</p>;

  return (
    <div className="state">
      <Icon name="check" size={48} className="state-icon ok" />
      <h1>Order Placed Successfully</h1>
      <p>Order ID: <strong>{order._id}</strong></p>
      <p>Total: <strong>{formatPrice(order.totalAmount)}</strong></p>
      <p>Status: <span className={`badge ${order.status}`}>{order.status}</span></p>
      <p className="muted">Your order has been saved successfully.</p>
      <div className="actions center-actions">
        <Link to="/orders" className="btn">View My Orders</Link>
        <Link to="/products" className="btn btn-outline">Continue Shopping</Link>
      </div>
    </div>
  );
}
