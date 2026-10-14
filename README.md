# ShopKart (Labs 01–06)

## Run
```bash
# backend  (needs MONGO_URI, JWT_SECRET, RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET in backend/.env)
cd backend && npm install && npm run seed && npm run dev      # http://localhost:5001
# frontend
cd frontend && npm install && npm run dev                       # http://localhost:5173
```
Razorpay: use **Test Mode** keys. Test card: `4111 1111 1111 1111`, any future expiry, any CVV; test UPI `success@razorpay`.

## Where each lab lives
| Lab | Backend | Frontend |
|---|---|---|
| 01 Auth | `controllers/customer.controller.js`, `middlewares/auth.middleware.js`, `utils/generateToken.js` | – |
| 02 Login UI | – | `pages/Login, Register, Home`, `context/AuthContext`, `services/api.js` |
| 03 Catalog | `product.*` | `pages/Products, ProductDetails`, `components/ProductCard, SearchBar` |
| 04 Wishlist | `wishlist.*`, `wishlist` field on Customer | `pages/Wishlist`, `components/WishlistCard` |
| 05 Cart | `cart.*`, `cart` field on Customer | `context/CartContext`, `pages/Cart`, `components/CartItem` |
| 06 Orders | `order.*`, `config/razorpay.js` | `pages/Checkout, Orders, OrderDetails, OrderSuccess` |

Bonuses done: change-password, product sorting, wishlist toggle + navbar count, order-status endpoint.
