# ShopKart

A full-stack e-commerce app built across Engineering Labs 01–06: customer authentication, a product catalogue, wishlist, shopping cart, and checkout with Razorpay (test mode) and order history.

| | |
|---|---|
| **Live site** | https://manideep-2007-ok.github.io/shopkart/ |
| **API** | https://shopkart-api-wo1n.onrender.com |
| **Repository** | https://github.com/Manideep-2007-ok/shopkart |

> The API runs on Render's free plan and sleeps when idle, so the first request after a quiet period can take 30–60 seconds. Login uses a cross-site cookie, which Safari, Brave and Firefox strict mode may block; use Chrome.

## Tech stack

- **Backend:** Node.js, Express 5, MongoDB (Mongoose), bcrypt, jsonwebtoken, cookie-parser, cors, Razorpay SDK
- **Frontend:** React 19 (Vite), React Router, Axios, Context API
- **Database:** MongoDB Atlas
- **Deployment:** GitHub Pages (frontend), Render (backend)

## Features

| Lab | What it covers |
|---|---|
| 01 Auth | Register, login, profile, logout. Passwords stored as bcrypt hashes; JWT in an HttpOnly cookie; protected routes via middleware. Bonus: change password |
| 02 Login UI | Register, Login and Home pages; protected home using `GET /customers/me`; logout from the navbar |
| 03 Catalogue | Product CRUD-lite (create, list, single), search, category filter, product details page, loading / error / empty states. Bonus: price sorting |
| 04 Wishlist | Wishlist stored as product references with `populate()`, add / remove / list, duplicate prevention. Bonus: toggle endpoint and navbar count |
| 05 Cart | Cart with quantities, stock validation, global cart state (Context API), live navbar count, derived subtotal |
| 06 Checkout | Shipping form with validation, server-side stock check and total, order snapshot, Razorpay test payment with signature verification, order history. Bonus: order status endpoint |

## Project structure

```
backend/
  config/        razorpay client
  controllers/   customer, product, wishlist, cart, order
  middlewares/   auth (JWT from cookie)
  models/        customer, product, order
  routes/        one router per resource
  scripts/       seed.js (sample products)
  utils/         token + id helpers
  index.js
frontend/
  public/img/    product photos
  src/
    components/  Navbar, ProductCard, CartItem, OrderSummary, ...
    context/     AuthContext, CartContext
    pages/       Login, Register, Home, Products, Cart, Checkout, Orders, ...
    services/    api.js (all HTTP calls)
```

## Running it locally

**Prerequisites:** Node.js 20+, a MongoDB database (a free MongoDB Atlas cluster works), and Razorpay **test** keys.

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env      # then fill in the values below
npm run seed              # inserts 12 sample products
npm run dev               # http://localhost:5001
```

`backend/.env`:

| Variable | Description |
|---|---|
| `PORT` | API port (default `5001`) |
| `MONGO_URI` | MongoDB connection string, including the database name (`.../shopkart`) |
| `JWT_SECRET` | Any long random string |
| `RAZORPAY_KEY_ID` | Razorpay **test** key id (`rzp_test_...`) |
| `RAZORPAY_KEY_SECRET` | Razorpay test key secret (backend only) |
| `CLIENT_URL` | Frontend origin for CORS (default `http://localhost:5173`) |

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env      # VITE_API_URL=http://localhost:5001
npm run dev               # http://localhost:5173
```

Open http://localhost:5173, register an account, log in and start shopping.

## Testing a payment (Razorpay test mode)

No real money is used. At checkout, pay with a Razorpay test card (any future expiry, any CVV), choose "Pay on bank's page" and click **Success**. If a card is rejected with `international_transaction_not_allowed`, try a different test card or UPI with `success@razorpay`. The cart is only cleared after the backend verifies the payment signature.

## API reference

All routes except register, login and `GET /products*` require the login cookie (or `Authorization: Bearer <token>`).

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/customers/register` | Create account |
| POST | `/customers/login` | Log in, sets HttpOnly cookie |
| GET | `/customers/me` | Current customer |
| POST | `/customers/logout` | Clear cookie |
| PATCH | `/customers/change-password` | Change password |
| GET | `/products` | List; `?search=`, `?category=`, `?sort=price_asc\|price_desc` |
| GET | `/products/:id` | One product |
| POST | `/products` | Create product |
| GET / POST / DELETE | `/wishlist`, `/wishlist/:productId` | List / add / remove |
| PATCH | `/wishlist/:productId/toggle` | Toggle saved state |
| GET | `/cart` | Cart with populated products |
| POST / PATCH / DELETE | `/cart/:productId` | Add (+1) / set quantity / remove |
| POST | `/orders/create-payment-order` | Validate cart, create pending order and Razorpay order |
| POST | `/orders/verify-payment` | Verify signature, mark paid, clear cart |
| GET | `/orders`, `/orders/:id` | Order history / one order (owner only) |
| PATCH | `/orders/:id/status` | Update order status (dev/bonus) |

## Design notes

- **Passwords** are hashed with bcrypt; login errors never reveal whether the email or the password was wrong.
- **Authentication** uses a JWT in an HttpOnly cookie, so browser JavaScript cannot read it. User identity always comes from the token, never from the request body or URL.
- **Wishlist and cart** store product references, so price and stock always come from the Product collection.
- **Orders** store a snapshot of each product's name, price and image, so history stays correct if the catalogue changes.
- **Checkout** recalculates the total and re-checks stock on the server and ignores any total sent by the client.
- **Payments:** the Razorpay order is created on the backend, and the payment signature (HMAC-SHA256) is verified there before an order is marked paid. The key secret never reaches the browser.

## Deployment

- **Frontend:** a GitHub Actions workflow (`.github/workflows/pages.yml`) builds `frontend/` and publishes it to GitHub Pages on every push to `main`. The API URL comes from the `VITE_API_URL` repository variable.
- **Backend:** deployed on Render from this repo (`render.yaml` describes the service). Set `MONGO_URI`, `JWT_SECRET`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `NODE_ENV=production` and `CLIENT_URL` in the Render dashboard, and allow Render's IPs in MongoDB Atlas Network Access.

## Notes

No secrets are committed: `.env` files are git-ignored and only `.env.example` templates are tracked. Product photos come from Wikimedia Commons (see `frontend/public/img/CREDITS.txt`).
