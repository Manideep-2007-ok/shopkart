import { formatPrice } from "../utils";

export default function OrderSummary({ items, itemCount, total, children }) {
  return (
    <aside className="summary">
      <h2>Order Summary</h2>
      {items.map((i) => (
        <div className="row" key={i.product._id}>
          <span>{i.product.name} × {i.quantity}</span>
          <span>{formatPrice(i.product.price * i.quantity)}</span>
        </div>
      ))}
      <hr />
      <div className="row"><span>Items</span><span>{itemCount}</span></div>
      <div className="row total"><span>Total</span><span>{formatPrice(total)}</span></div>
      {children}
    </aside>
  );
}
