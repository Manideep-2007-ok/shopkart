import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { getWishlist } from "../services/api";

export default function Navbar() {
  const { logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [wishCount, setWishCount] = useState(0);

  useEffect(() => {
    let active = true;
    const load = () =>
      getWishlist()
        .then(({ data }) => active && setWishCount(data.count))
        .catch(() => {});
    load();
    window.addEventListener("wishlist-changed", load);
    return () => {
      active = false;
      window.removeEventListener("wishlist-changed", load);
    };
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/home" className="brand">ShopKart</Link>
      <div className="nav-links">
        <NavLink to="/home">Home</NavLink>
        <NavLink to="/products">Products</NavLink>
        <NavLink to="/wishlist">Wishlist ({wishCount})</NavLink>
        <NavLink to="/cart">Cart ({itemCount})</NavLink>
        <NavLink to="/orders">Orders</NavLink>
        <button className="btn btn-outline" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}
