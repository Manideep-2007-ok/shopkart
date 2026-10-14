const jwt = require("jsonwebtoken");

const COOKIE_NAME = "token";
const MAX_AGE = 7 * 24 * 60 * 60 * 1000;

const generateToken = (customerId) =>
  jwt.sign({ id: customerId }, process.env.JWT_SECRET, { expiresIn: "7d" });

const cookieOptions = {
  httpOnly: true,
  // frontend (github.io) and API (onrender.com) are different sites in production,
  // so the cookie must be SameSite=None + Secure there
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  secure: process.env.NODE_ENV === "production",
  maxAge: MAX_AGE,
};

module.exports = { generateToken, cookieOptions, COOKIE_NAME };
