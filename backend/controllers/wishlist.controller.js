const Customer = require("../models/customer.model");
const Product = require("../models/product.model");
const isValidId = require("../utils/validateId");

const inWishlist = (user, productId) => user.wishlist.some((id) => id.toString() === productId);

exports.addToWishlist = async (req, res) => {
  const { productId } = req.params;
  if (!isValidId(productId)) return res.status(400).json({ success: false, message: "Invalid product ID" });

  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ success: false, message: "Product not found" });

  const user = await Customer.findById(req.user._id);
  if (inWishlist(user, productId)) {
    return res.status(409).json({ success: false, message: "Product already in wishlist" });
  }

  user.wishlist.push(product._id);
  await user.save();
  res.status(201).json({ success: true, message: "Product added to wishlist" });
};

exports.getWishlist = async (req, res) => {
  const user = await Customer.findById(req.user._id).populate({
    path: "wishlist",
    select: "name price category image stock",
  });
  const wishlist = user.wishlist.filter(Boolean);
  res.status(200).json({ success: true, count: wishlist.length, wishlist });
};

exports.removeFromWishlist = async (req, res) => {
  const { productId } = req.params;
  if (!isValidId(productId)) return res.status(400).json({ success: false, message: "Invalid product ID" });

  const user = await Customer.findById(req.user._id);
  if (!inWishlist(user, productId)) {
    return res.status(404).json({ success: false, message: "Product not in wishlist" });
  }

  user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);
  await user.save();
  res.status(200).json({ success: true, message: "Product removed from wishlist" });
};

exports.toggleWishlist = async (req, res) => {
  const { productId } = req.params;
  if (!isValidId(productId)) return res.status(400).json({ success: false, message: "Invalid product ID" });

  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ success: false, message: "Product not found" });

  const user = await Customer.findById(req.user._id);
  let saved;
  if (inWishlist(user, productId)) {
    user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);
    saved = false;
  } else {
    user.wishlist.push(product._id);
    saved = true;
  }
  await user.save();
  res.status(200).json({ success: true, saved, count: user.wishlist.length });
};
