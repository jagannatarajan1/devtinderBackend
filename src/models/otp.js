const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  emailId: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  userData: {
    type: Object, // Store temporary user info
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300, // OTP auto-deletes after 5 minutes
  },
});

module.exports = mongoose.model("Otp", otpSchema);
