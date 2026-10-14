import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5001",
  withCredentials: true,
});

export const errorMessage = (err, fallback = "Something went wrong") =>
  err?.response?.data?.message || fallback;

export const registerCustomer = (data) => api.post("/customers/register", data);
export const loginCustomer = (data) => api.post("/customers/login", data);
export const getMe = () => api.get("/customers/me");
export const logoutCustomer = () => api.post("/customers/logout");

export const getProducts = (params) => api.get("/products", { params });
export const getProduct = (id) => api.get(`/products/${id}`);

export const getWishlist = () => api.get("/wishlist");
export const addToWishlist = (id) => api.post(`/wishlist/${id}`);
export const removeFromWishlist = (id) => api.delete(`/wishlist/${id}`);

export const getCart = () => api.get("/cart");
export const addToCartApi = (id) => api.post(`/cart/${id}`);
export const updateCartQty = (id, quantity) => api.patch(`/cart/${id}`, { quantity });
export const removeFromCartApi = (id) => api.delete(`/cart/${id}`);

export const createPaymentOrder = (shippingAddress) =>
  api.post("/orders/create-payment-order", { shippingAddress });
export const verifyPayment = (data) => api.post("/orders/verify-payment", data);
export const getOrders = () => api.get("/orders");
export const getOrder = (id) => api.get(`/orders/${id}`);

export default api;
