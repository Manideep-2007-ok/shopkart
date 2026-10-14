import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CheckoutForm, { validateShipping } from "../components/CheckoutForm";
import OrderSummary from "../components/OrderSummary";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { createPaymentOrder, errorMessage, verifyPayment } from "../services/api";

const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

export default function Checkout() {
  const { user } = useAuth();
  const { cartItems, loading: cartLoading, itemCount, subtotal, clearCartState } = useCart();
  const navigate = useNavigate();
  const [values, setValues] = useState({
    fullName: user?.fullName || "", phone: user?.phone || "", addressLine1: "", city: "", state: "", pincode: "",
  });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [placing, setPlacing] = useState(false);

  if (cartLoading) return <p className="state">Loading your cart...</p>;
  if (cartItems.length === 0)
    return (
      <div className="state">
        <h2>Your cart is empty</h2>
        <p>Add some products before checking out.</p>
        <Link to="/products" className="btn">Browse Products</Link>
      </div>
    );

  const handlePlaceOrder = async () => {
    setFormError("");
    const v = validateShipping(values);
    setErrors(v);
    if (Object.keys(v).length) return;

    setPlacing(true);
    try {
      const ready = await loadRazorpayScript();
      if (!ready) throw new Error("Unable to load Razorpay. Check your connection.");

      const { data } = await createPaymentOrder(values);

      const rzp = new window.Razorpay({
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: "ShopKart",
        description: "ShopKart Order",
        order_id: data.razorpayOrderId,
        handler: async (response) => {
          try {
            await verifyPayment({
              shopKartOrderId: data.shopKartOrderId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            clearCartState();
            navigate(`/order-success/${data.shopKartOrderId}`);
          } catch (err) {
            setFormError(errorMessage(err, "Payment could not be verified. Your cart has not been cleared."));
            setPlacing(false);
          }
        },
        prefill: { name: values.fullName, contact: values.phone },
        modal: { ondismiss: () => setPlacing(false) },
      });
      rzp.on("payment.failed", (response) => {
        const e = response?.error || {};
        console.error("Razorpay payment.failed", e);
        const detail = [e.description, e.reason && `reason: ${e.reason}`, e.code && `code: ${e.code}`, e.step && `step: ${e.step}`]
          .filter(Boolean)
          .join(" | ");
        setFormError(`Payment failed. Your cart has not been cleared. Please try again.${detail ? ` (${detail})` : ""}`);
        setPlacing(false);
      });
      rzp.open();
    } catch (err) {
      setFormError(errorMessage(err, err.message || "Could not place order"));
      setPlacing(false);
    }
  };

  return (
    <div>
      <h1>Checkout</h1>
      <div className="cart-layout">
        <CheckoutForm values={values} setValues={setValues} errors={errors} />
        <OrderSummary items={cartItems} itemCount={itemCount} total={subtotal}>
          {formError && <p className="error">{formError}</p>}
          <button className="btn btn-block" onClick={handlePlaceOrder} disabled={placing}>
            {placing ? "Processing..." : "Place Order"}
          </button>
        </OrderSummary>
      </div>
    </div>
  );
}
