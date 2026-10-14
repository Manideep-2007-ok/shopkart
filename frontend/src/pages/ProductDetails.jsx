import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { getProduct } from "../services/api";
import { formatPrice, stockText, imageUrl } from "../utils";

export default function ProductDetails() {
  const { id } = useParams();
  const { busy, addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    getProduct(id)
      .then(({ data }) => setProduct(data.product))
      .catch((err) => setError(err.response?.status === 404 ? "Product not found." : "Something went wrong while loading the product."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="state">Loading product...</p>;
  if (error) return <p className="state error">{error} <Link to="/products">Back to products</Link></p>;

  const handleAdd = async () => {
    setMessage("");
    const res = await addToCart(product._id);
    setMessage(res.ok ? "Added to cart" : res.message);
  };

  return (
    <div className="details">
      <img src={imageUrl(product.image)} alt={product.name} />
      <div>
        <h1>{product.name}</h1>
        <p className="muted">{product.category}</p>
        <p className="price big">{formatPrice(product.price)}</p>
        <p>{product.description}</p>
        <p className={product.stock === 0 ? "danger" : "muted"}>{stockText(product.stock)}</p>
        <button className="btn" onClick={handleAdd} disabled={product.stock === 0 || busy[product._id]}>
          {busy[product._id] ? "Adding..." : "Add to Cart"}
        </button>
        {message && <p className={message.startsWith("Added") ? "success" : "error"}>{message}</p>}
        <p><Link to="/products">← Back to products</Link></p>
      </div>
    </div>
  );
}
