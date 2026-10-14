import { useState } from "react";
import { Link } from "react-router-dom";
import Icon from "./Icon";
import { useCart } from "../context/CartContext";
import { addToWishlist, errorMessage } from "../services/api";
import { formatPrice, notifyWishlistChanged, stockText, imageUrl } from "../utils";

export default function ProductCard({ product, initiallySaved = false }) {
  const { cartItems, busy, addToCart } = useCart();
  const [wishState, setWishState] = useState(initiallySaved ? "saved" : "idle");
  const [message, setMessage] = useState("");

  const inCart = cartItems.find((i) => i.product._id === product._id);
  const outOfStock = product.stock === 0;
  const adding = !!busy[product._id];

  const handleWishlist = async () => {
    if (wishState !== "idle") return;
    setWishState("saving");
    setMessage("");
    try {
      await addToWishlist(product._id);
      setWishState("saved");
      notifyWishlistChanged();
    } catch (err) {
      if (err.response?.status === 409) {
        setWishState("saved");
      } else {
        setWishState("idle");
        setMessage(errorMessage(err, "Unable to save product. Please try again."));
      }
    }
  };

  const handleAddToCart = async () => {
    setMessage("");
    const res = await addToCart(product._id);
    if (!res.ok) setMessage(res.message);
  };

  return (
    <div className="card">
      <div className="card-img">
        <img src={imageUrl(product.image)} alt={product.name} loading="lazy" />
        <span className={`heart ${wishState === "saved" ? "on" : ""}`}><Icon name="heart" size={22} filled={wishState === "saved"} /></span>
      </div>
      <div className="card-body">
        <h3>{product.name}</h3>
        <p className="muted">{product.category}</p>
        <p className="price">{formatPrice(product.price)}</p>
        <p className={outOfStock ? "danger" : "muted"}>{stockText(product.stock)}</p>

        <div className="actions">
          <Link to={`/products/${product._id}`} className="btn btn-outline">View Details</Link>
          <button className="btn btn-outline" onClick={handleWishlist} disabled={wishState !== "idle"}>
            {wishState === "saving" ? (
              <><Icon name="spinner" size={15} /> Saving...</>
            ) : wishState === "saved" ? (
              <><Icon name="heart" size={15} filled /> Added to Wishlist</>
            ) : (
              <><Icon name="heart" size={15} /> Add to Wishlist</>
            )}
          </button>
          <button className="btn" onClick={handleAddToCart} disabled={adding || outOfStock}>
            {adding ? "Adding..." : inCart ? "Add Another" : "Add to Cart"}
          </button>
        </div>
        {message && <p className="error">{message}</p>}
      </div>
    </div>
  );
}
