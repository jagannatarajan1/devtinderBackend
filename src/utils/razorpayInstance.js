const Razorpay = require("razorpay");
require(Razorpay);

var instance = new Razorpay({
  key_id: process.env.key_id,
  key_secret: process.env.key_secret,
});

module.exports = instance;
