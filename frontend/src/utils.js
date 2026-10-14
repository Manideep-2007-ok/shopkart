// product images are stored as "/img/x.jpg"; prefix them with the site's base path
export const imageUrl = (src) =>
  src && src.startsWith("/") ? import.meta.env.BASE_URL + src.slice(1) : src;

export const formatPrice = (n) => `₹${Number(n).toLocaleString("en-IN")}`;
export const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

export const stockText = (stock) =>
  stock === 0 ? "Out of stock" : stock <= 10 ? `${stock} units left` : "In stock";

export const notifyWishlistChanged = () => window.dispatchEvent(new Event("wishlist-changed"));
