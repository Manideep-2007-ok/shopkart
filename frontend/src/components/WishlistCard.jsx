import { Link } from "react-router-dom";
import { formatPrice, stockText, imageUrl } from "../utils";

export default function WishlistCard({ product, onRemove, removing }) {
  return (
    <div className="card">
      <div className="card-img">
        <img src={imageUrl(product.image)} alt={product.name} loading="lazy" />
      </div>
      <div className="card-body">
        <h3>{product.name}</h3>
        <p className="muted">{product.category}</p>
        <p className="price">{formatPrice(product.price)}</p>
        <p className={product.stock === 0 ? "danger" : "muted"}>{stockText(product.stock)}</p>
        <div className="actions">
          <Link to={`/products/${product._id}`} className="btn btn-outline">View Details</Link>
          <button className="btn btn-danger" onClick={() => onRemove(product._id)} disabled={removing}>
            {removing ? "Removing..." : "Remove from Wishlist"}
          </button>
        </div>
      </div>
    </div>
  );
}
