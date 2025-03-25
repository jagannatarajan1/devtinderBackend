const express = require("express");
const paymentRoutes = express.Router();
const { userAuth } = require("../middlewares/auth");
paymentRoutes.post("/payment/create", userAuth, (req, res) => {
  // Your payment logic here...
  try {
  } catch (err) {}

  res.send("Payment successful!");
});

module.exports = paymentRoutes;
