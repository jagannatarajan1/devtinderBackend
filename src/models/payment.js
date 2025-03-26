const mongoose = require("mongoose");
const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    orderId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    notes: {
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
      },
      membership: {
        type: String,
        required: true,
      },
    },
    receipt: {
      type: String,
      required: true,
    },
    attempts: {
      type: Number,
      default: 0,
    },
    amount_due: {
      type: Number,
      required: true,
    },
    entity: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("paymentSchema", paymentSchema);
