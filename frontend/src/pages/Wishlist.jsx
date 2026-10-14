import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Icon from "../components/Icon";
import WishlistCard from "../components/WishlistCard";
import { errorMessage, getWishlist, removeFromWishlist } from "../services/api";
import { notifyWishlistChanged } from "../utils";

export default function Wishlist() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [removing, setRemoving] = useState(null);
  const [actionError, setActionError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const { data } = await getWishlist();
      setItems(data.wishlist);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleRemove = async (id) => {
    setRemoving(id);
    setActionError("");
    try {
      await removeFromWishlist(id);
      setItems((prev) => prev.filter((p) => p._id !== id));
      notifyWishlistChanged();
    } catch (err) {
      setActionError(errorMessage(err, "Could not remove product."));
    } finally {
      setRemoving(null);
    }
  };

  if (loading) return <p className="state">Loading your wishlist...</p>;
  if (error)
    return (
      <div className="state">
        <h2>Something went wrong.</h2>
        <p>We couldn't load your wishlist.</p>
        <button className="btn" onClick={load}>Try Again</button>
      </div>
    );
  if (items.length === 0)
    return (
      <div className="state">
        <Icon name="heart" size={48} className="state-icon" />
        <h2>Your wishlist is empty</h2>
        <p>Save products you love and find them here later.</p>
        <Link to="/products" className="btn">Browse Products</Link>
      </div>
    );

  return (
    <div>
      <h1>My Wishlist</h1>
      <p className="muted">{items.length} product{items.length !== 1 && "s"} saved</p>
      {actionError && <p className="error">{actionError}</p>}
      <div className="grid">
        {items.map((p) => (
          <WishlistCard key={p._id} product={p} onRemove={handleRemove} removing={removing === p._id} />
        ))}
      </div>
    </div>
  );
}
