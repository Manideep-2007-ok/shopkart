const Customer = require("../models/customer.model");
const Product = require("../models/product.model");
const isValidId = require("../utils/validateId");

const PRODUCT_FIELDS = "name price category image stock";

const loadCart = async (userId) => {
  const user = await Customer.findById(userId).populate({ path: "cart.product", select: PRODUCT_FIELDS });
  const cart = user.cart.filter((item) => item.product);
  if (cart.length !== user.cart.length) {
    user.cart = cart.map((i) => ({ product: i.product._id, quantity: i.quantity }));
    await user.save();
  }
  return cart.map((i) => ({ product: i.product, quantity: i.quantity }));
};

const findItem = (user, productId) => user.cart.find((i) => i.product.toString() === productId);

exports.addToCart = async (req, res) => {
  const { productId } = req.params;
  if (!isValidId(productId)) return res.status(400).json({ success: false, message: "Invalid product ID" });

  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ success: false, message: "Product not found" });

  const user = await Customer.findById(req.user._id);
  const item = findItem(user, productId);
  const newQty = (item ? item.quantity : 0) + 1;

  if (newQty > product.stock) {
    return res.status(400).json({
      success: false,
      message: product.stock === 0 ? "Product is out of stock" : `Only ${product.stock} unit(s) available`,
    });
  }

  if (item) item.quantity = newQty;
  else user.cart.push({ product: product._id, quantity: 1 });
  await user.save();

  res.status(200).json({ success: true, message: "Cart updated", cart: await loadCart(user._id) });
};

exports.getCart = async (req, res) => {
  res.status(200).json({ success: true, cart: await loadCart(req.user._id) });
};

exports.updateQuantity = async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body || {};

  if (!isValidId(productId)) return res.status(400).json({ success: false, message: "Invalid product ID" });
  if (typeof quantity !== "number" || !Number.isInteger(quantity)) {
    return res.status(400).json({ success: false, message: "Quantity must be a whole number" });
  }
  if (quantity < 1) return res.status(400).json({ success: false, message: "Quantity must be at least 1" });

  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ success: false, message: "Product not found" });

  const user = await Customer.findById(req.user._id);
  const item = findItem(user, productId);
  if (!item) return res.status(404).json({ success: false, message: "Product not in cart" });

  if (quantity > product.stock) {
    return res.status(400).json({ success: false, message: `Only ${product.stock} unit(s) available` });
  }

  item.quantity = quantity;
  await user.save();
  res.status(200).json({ success: true, message: "Quantity updated", cart: await loadCart(user._id) });
};

exports.removeFromCart = async (req, res) => {
  const { productId } = req.params;
  if (!isValidId(productId)) return res.status(400).json({ success: false, message: "Invalid product ID" });

  const user = await Customer.findById(req.user._id);
  if (!findItem(user, productId)) {
    return res.status(404).json({ success: false, message: "Product not in cart" });
  }

  user.cart = user.cart.filter((i) => i.product.toString() !== productId);
  await user.save();
  res.status(200).json({ success: true, message: "Item removed", cart: await loadCart(user._id) });
};
