import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatPrice, imageUrl } from "../utils";

export default function CartItem({ item }) {
  const { busy, updateQuantity, removeFromCart } = useCart();
  const [message, setMessage] = useState("");
  const { product, quantity } = item;
  const loading = !!busy[product._id];

  const change = async (qty) => {
    setMessage("");
    const res = await updateQuantity(product._id, qty);
    if (!res.ok) setMessage(res.message);
  };

  return (
    <div className="cart-item">
      <img src={imageUrl(product.image)} alt={product.name} />
      <div className="cart-info">
        <Link to={`/products/${product._id}`}><h3>{product.name}</h3></Link>
        <p className="muted">{formatPrice(product.price)}</p>
        <div className="qty">
          <button className="btn btn-outline" onClick={() => change(quantity - 1)} disabled={loading || quantity <= 1}>−</button>
          <span>{quantity}</span>
          <button className="btn btn-outline" onClick={() => change(quantity + 1)} disabled={loading || quantity >= product.stock}>+</button>
        </div>
        <button className="btn btn-danger" onClick={() => removeFromCart(product._id)} disabled={loading}>Remove</button>
        {message && <p className="error">{message}</p>}
      </div>
      <div className="line-total">{formatPrice(product.price * quantity)}</div>
    </div>
  );
}
