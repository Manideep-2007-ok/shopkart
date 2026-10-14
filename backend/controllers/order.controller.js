const crypto = require("crypto");
const Customer = require("../models/customer.model");
const Product = require("../models/product.model");
const Order = require("../models/order.model");
const getRazorpay = require("../config/razorpay");
const isValidId = require("../utils/validateId");

const ADDRESS_FIELDS = ["fullName", "phone", "addressLine1", "city", "state", "pincode"];

const validateAddress = (addr) => {
  if (!addr || typeof addr !== "object") return "Shipping address is required";
  for (const f of ADDRESS_FIELDS) {
    if (typeof addr[f] !== "string" || addr[f].trim() === "") return `${f} is required`;
  }
  if (!/^[0-9]{10}$/.test(addr.phone.trim())) return "Phone must be a valid 10 digit number";
  if (!/^[0-9]{6}$/.test(addr.pincode.trim())) return "Pincode must contain 6 digits";
  return null;
};

exports.createPaymentOrder = async (req, res) => {
  const { shippingAddress } = req.body || {};
  const addrError = validateAddress(shippingAddress);
  if (addrError) return res.status(400).json({ success: false, message: addrError });

  const user = await Customer.findById(req.user._id);
  if (user.cart.length === 0) return res.status(400).json({ success: false, message: "Cart is empty" });

  // Reload the LATEST product data; never trust prices/items from the client
  const items = [];
  let totalAmount = 0;
  for (const cartItem of user.cart) {
    const product = await Product.findById(cartItem.product);
    if (!product) {
      return res.status(400).json({ success: false, message: "A product in your cart is no longer available" });
    }
    if (product.stock < cartItem.quantity) {
      return res.status(400).json({ success: false, message: `Insufficient stock for ${product.name}.` });
    }
    items.push({
      product: product._id,
      name: product.name,
      price: product.price,
      quantity: cartItem.quantity,
      image: product.image,
    });
    totalAmount += product.price * cartItem.quantity;
  }

  const trimmed = {};
  ADDRESS_FIELDS.forEach((f) => (trimmed[f] = shippingAddress[f].trim()));

  const order = await Order.create({ user: user._id, items, shippingAddress: trimmed, totalAmount });

  try {
    const razorpayOrder = await getRazorpay().orders.create({
      amount: Math.round(totalAmount * 100),
      currency: "INR",
      receipt: order._id.toString(),
    });
    order.razorpayOrderId = razorpayOrder.id;
    await order.save();

    res.status(201).json({
      success: true,
      shopKartOrderId: order._id,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    order.paymentStatus = "FAILED";
    await order.save();
    console.error("Razorpay order error:", err.error?.description || err.message);
    res.status(502).json({ success: false, message: "Could not start payment. Please try again." });
  }
};

exports.verifyPayment = async (req, res) => {
  const { shopKartOrderId, razorpay_payment_id, razorpay_signature } = req.body || {};

  if (!isValidId(shopKartOrderId)) return res.status(400).json({ success: false, message: "Invalid order ID" });
  if (typeof razorpay_payment_id !== "string" || typeof razorpay_signature !== "string") {
    return res.status(400).json({ success: false, message: "Payment details are required" });
  }

  const order = await Order.findOne({ _id: shopKartOrderId, user: req.user._id });
  if (!order) return res.status(404).json({ success: false, message: "Order not found" });

  if (order.paymentStatus === "PAID") {
    return res.status(200).json({ success: true, message: "Payment already verified", order });
  }
  if (!order.razorpayOrderId) {
    return res.status(400).json({ success: false, message: "Payment was not initiated for this order" });
  }

  // Trusted order id comes from OUR database, not from the browser
  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
    .update(`${order.razorpayOrderId}|${razorpay_payment_id}`)
    .digest("hex");

  const a = Buffer.from(expected);
  const b = Buffer.from(razorpay_signature);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return res.status(400).json({ success: false, message: "Invalid payment signature" });
  }

  order.paymentStatus = "PAID";
  order.status = "PLACED";
  order.razorpayPaymentId = razorpay_payment_id;
  await order.save();

  await Customer.updateOne({ _id: req.user._id }, { $set: { cart: [] } });

  res.status(200).json({ success: true, message: "Payment verified, order placed", order });
};

exports.getOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id, paymentStatus: "PAID" }).sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: orders.length, orders });
};

exports.getOrderById = async (req, res) => {
  const { id } = req.params;
  if (!isValidId(id)) return res.status(400).json({ success: false, message: "Invalid order ID" });

  const order = await Order.findOne({ _id: id, user: req.user._id });
  if (!order) return res.status(404).json({ success: false, message: "Order not found" });

  res.status(200).json({ success: true, order });
};

exports.updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body || {};
  if (!isValidId(id)) return res.status(400).json({ success: false, message: "Invalid order ID" });
  if (!["PLACED", "CONFIRMED", "SHIPPED", "DELIVERED"].includes(status)) {
    return res.status(400).json({ success: false, message: "Invalid status" });
  }
  const order = await Order.findOne({ _id: id, user: req.user._id, paymentStatus: "PAID" });
  if (!order) return res.status(404).json({ success: false, message: "Order not found" });

  order.status = status;
  await order.save();
  res.status(200).json({ success: true, order });
};
