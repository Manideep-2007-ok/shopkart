const jwt = require("jsonwebtoken");
const Customer = require("../models/customer.model");
const { COOKIE_NAME } = require("../utils/generateToken");

const protect = async (req, res, next) => {
  try {
    let token = req.cookies?.[COOKIE_NAME];
    const header = req.headers.authorization;
    if (!token && header?.startsWith("Bearer ")) token = header.split(" ")[1];

    if (!token) return res.status(401).json({ success: false, message: "Not authenticated" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const customer = await Customer.findById(decoded.id).select("-password");
    if (!customer) return res.status(401).json({ success: false, message: "Not authenticated" });

    req.user = customer;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

module.exports = protect;
