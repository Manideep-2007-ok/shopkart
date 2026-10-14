import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthContext";
import { addToCartApi, errorMessage, getCart, removeFromCartApi, updateCartQty } from "../services/api";

const CartContext = createContext(null);
export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState({});

  const refreshCart = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await getCart();
      setCartItems(data.cart);
    } catch (err) {
      setError(errorMessage(err, "Unable to load your cart."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) refreshCart();
    else {
      setCartItems([]);
      setError("");
    }
  }, [user, refreshCart]);

  const mutate = async (productId, call) => {
    setBusy((b) => ({ ...b, [productId]: true }));
    try {
      const { data } = await call();
      setCartItems(data.cart);
      return { ok: true };
    } catch (err) {
      return { ok: false, message: errorMessage(err, "Cart update failed") };
    } finally {
      setBusy((b) => ({ ...b, [productId]: false }));
    }
  };

  const addToCart = (id) => mutate(id, () => addToCartApi(id));
  const updateQuantity = (id, qty) => mutate(id, () => updateCartQty(id, qty));
  const removeFromCart = (id) => mutate(id, () => removeFromCartApi(id));
  const clearCartState = () => setCartItems([]);

  const itemCount = useMemo(() => cartItems.reduce((n, i) => n + i.quantity, 0), [cartItems]);
  const subtotal = useMemo(() => cartItems.reduce((s, i) => s + i.product.price * i.quantity, 0), [cartItems]);

  return (
    <CartContext.Provider
      value={{
        cartItems, loading, error, busy, itemCount, subtotal,
        refreshCart, addToCart, updateQuantity, removeFromCart, clearCartState,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
