const bcrypt = require("bcrypt");
const Customer = require("../models/customer.model");
const { generateToken, cookieOptions, COOKIE_NAME } = require("../utils/generateToken");

const publicCustomer = (c) => ({
  _id: c._id,
  fullName: c.fullName,
  email: c.email,
  phone: c.phone,
});

const isBlank = (v) => typeof v !== "string" || v.trim() === "";

exports.register = async (req, res) => {
  const { fullName, email, password, phone } = req.body || {};

  if ([fullName, email, password, phone].some(isBlank)) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }
  if (password.length < 6) {
    return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
  }

  const exists = await Customer.findOne({ email: email.trim().toLowerCase() });
  if (exists) return res.status(409).json({ success: false, message: "Email already registered" });

  const hashed = await bcrypt.hash(password, 10);
  let customer;
  try {
    customer = await Customer.create({ fullName, email, password: hashed, phone });
  } catch (err) {
    if (err.code === 11000) {
      // race condition: unique index caught a duplicate the findOne missed
      return res.status(409).json({ success: false, message: "Email already registered" });
    }
    throw err;
  }

  res.status(201).json({
    success: true,
    message: "Customer registered successfully",
    customer: publicCustomer(customer),
  });
};

exports.login = async (req, res) => {
  const { email, password } = req.body || {};
  if (isBlank(email) || isBlank(password)) {
    return res.status(401).json({ success: false, message: "Invalid credentials" });
  }

  const customer = await Customer.findOne({ email: email.trim().toLowerCase() });
  const ok = customer && (await bcrypt.compare(password, customer.password));
  if (!ok) return res.status(401).json({ success: false, message: "Invalid credentials" });

  res.cookie(COOKIE_NAME, generateToken(customer._id), cookieOptions);
  res.status(200).json({
    success: true,
    message: "Login successful",
    customer: publicCustomer(customer),
  });
};

exports.getMe = (req, res) => {
  res.status(200).json(publicCustomer(req.user));
};

exports.logout = (req, res) => {
  const { maxAge, ...clearOptions } = cookieOptions;
  res.clearCookie(COOKIE_NAME, clearOptions);
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

exports.changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body || {};
  if (isBlank(oldPassword) || isBlank(newPassword)) {
    return res.status(400).json({ success: false, message: "Old and new password are required" });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ success: false, message: "New password must be at least 6 characters" });
  }

  const customer = await Customer.findById(req.user._id);
  if (!(await bcrypt.compare(oldPassword, customer.password))) {
    return res.status(401).json({ success: false, message: "Old password is incorrect" });
  }
  customer.password = await bcrypt.hash(newPassword, 10);
  await customer.save();
  res.status(200).json({ success: true, message: "Password changed successfully" });
};
