const Product = require("../models/product.model");
const isValidId = require("../utils/validateId");

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, product });
  } catch (err) {
    if (err.name === "ValidationError" || err.name === "CastError") {
      return res.status(400).json({ success: false, message: err.message });
    }
    throw err;
  }
};

exports.getProducts = async (req, res) => {
  const { search, category, sort } = req.query;
  const filter = {};

  if (typeof search === "string" && search.trim()) {
    filter.name = { $regex: escapeRegex(search.trim()), $options: "i" };
  }
  if (typeof category === "string" && category.trim()) {
    filter.category = category.trim();
  }

  let sortBy = { createdAt: -1 };
  if (sort === "price_asc") sortBy = { price: 1 };
  else if (sort === "price_desc") sortBy = { price: -1 };

  const products = await Product.find(filter)
    .select("name price category image stock")
    .sort(sortBy);

  res.status(200).json({ success: true, count: products.length, products });
};

exports.getProductById = async (req, res) => {
  const { id } = req.params;
  if (!isValidId(id)) return res.status(400).json({ success: false, message: "Invalid product ID" });

  const product = await Product.findById(id);
  if (!product) return res.status(404).json({ success: false, message: "Product not found" });

  res.status(200).json({ success: true, product });
};
