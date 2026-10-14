import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import OrderCard from "../components/OrderCard";
import { getOrders } from "../services/api";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const { data } = await getOrders();
      setOrders(data.orders);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <p className="state">Loading your orders...</p>;
  if (error)
    return (
      <div className="state">
        <h2>Unable to load your orders.</h2>
        <button className="btn" onClick={load}>Try Again</button>
      </div>
    );
  if (orders.length === 0)
    return (
      <div className="state">
        <h2>You have not placed any orders yet.</h2>
        <Link to="/products" className="btn">Start Shopping</Link>
      </div>
    );

  return (
    <div>
      <h1>My Orders</h1>
      {orders.map((o) => (
        <OrderCard key={o._id} order={o} />
      ))}
    </div>
  );
}
