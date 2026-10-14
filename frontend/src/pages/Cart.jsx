import { Link, useNavigate } from "react-router-dom";
import Icon from "../components/Icon";
import CartItem from "../components/CartItem";
import OrderSummary from "../components/OrderSummary";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { cartItems, loading, error, itemCount, subtotal, refreshCart } = useCart();
  const navigate = useNavigate();

  if (loading && cartItems.length === 0) return <p className="state">Loading your cart...</p>;
  if (error)
    return (
      <div className="state">
        <h2>Unable to load your cart.</h2>
        <button className="btn" onClick={refreshCart}>Try Again</button>
      </div>
    );
  if (cartItems.length === 0)
    return (
      <div className="state">
        <Icon name="cart" size={48} className="state-icon" />
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added anything yet.</p>
        <Link to="/products" className="btn">Browse Products</Link>
      </div>
    );

  return (
    <div>
      <h1>My Cart</h1>
      <div className="cart-layout">
        <div>
          {cartItems.map((item) => (
            <CartItem key={item.product._id} item={item} />
          ))}
        </div>
        <OrderSummary items={cartItems} itemCount={itemCount} total={subtotal}>
          <button className="btn btn-block" onClick={() => navigate("/checkout")}>Proceed to Checkout</button>
        </OrderSummary>
      </div>
    </div>
  );
}
