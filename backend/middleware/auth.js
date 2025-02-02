const jwt = require("jsonwebtoken");
require("dotenv").config();

// Authentication Middleware
const auth = (req, res, next) => {
  const token = req.header("x-auth-token") || req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access Denied: No Token Provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info to request
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid Token", error: error.message });
  }
};

// Role-Based Authorization Middleware
const authorize = (roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: "Access Denied: Insufficient Permissions" });
  }
  next();
};

module.exports = { auth, authorize };
