const jwt = require("jsonwebtoken");
const User = require("../models/user");
const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("No token provided");
    }

    // Verify the token
    const decoded = await jwt.verify(token, process.env.ENCRYPT_KEY);
    if (!decoded) {
      throw new Error("Invalid token");
    }
    const { id } = decoded;
    const user = await User.findById(id);
    if (!user) {
      throw new Error("User not found");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

module.exports = {
  userAuth,
};
