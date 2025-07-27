const express = require("express");
const paymentRoutes = express.Router();
const { userAuth } = require("../middlewares/auth");
const razorpayInstance = require("../utils/razorpayInstance");
const paymentSchema = require("../models/payment");
const User = require("../models/user");
const {
  validateWebhookSignature,
} = require("razorpay/dist/utils/razorpay-utils");
const { findOne } = require("../models/user");
paymentRoutes.post("/payment/create", userAuth, async (req, res) => {
  try {
    // Create the Razorpay order
    const { type } = req.body;
    const { firstName, lastName, email } = req.user;
    const razorpayKey = process.env.key_id;
    console.log("Creating payment with type:", razorpayKey);
    const payment = await razorpayInstance.orders.create({
      amount: 49900, // Amount in paise
      currency: "INR",
      receipt: "receipt#1",
      notes: {
        firstName,
        lastName,
        membership: type,
      },
    });

    console.log("Payment created:", payment);

    // Save the payment details in your database
    const newPayment = new paymentSchema({
      orderId: payment.id,
      amount: payment.amount,
      currency: payment.currency,
      notes: payment.notes,
      status: payment.status,
      userId: req.user._id,
      entity: payment.entity,
      amount_due: payment.amount_due,
      receipt: payment.receipt,
      attempts: payment.attempts,
    });

    await newPayment.save();
    console.log("New payment saved:", newPayment);

    // Send the response to the client after saving
    res.status(201).json({
      message: "Payment created successfully",
      newPayment,
      razorpayKey,
    });
  } catch (err) {
    console.error("Error creating payment:", err);
    res.status(500).json({ error: "Failed to create payment" });
  }
});
paymentRoutes.post("/payment/webhook", async (req, res) => {
  try {
    const webhookSignature = req.get("X-Razorpay-Signature");
    const isWebHookValid = validateWebhookSignature(
      JSON.stringify(req.body),
      webhookSignature,
      process.env.webhook_Secret
    );
    if (!isWebHookValid) {
      console.log("Invalid Webhook Signature");
      return res.status(400).json({ msg: "Webhook signature is invalid" });
    }
    console.log("Webhook signature is valid");
    const paymentDetails = req.body.payload.payment.entity;
    // const paymentId = paymentDetails.id;
    const orderId = paymentDetails.order_id;
    const paymentDb = await paymentSchema.findOne({ orderId: orderId });
    if (!paymentDb) {
      return res.status(404).send("Payment not found");
    }
    paymentDb.status = paymentDetails.status;

    await paymentDb.save();

    if (paymentDetails.status === "captured") {
      const user = await User.findById(paymentDb.userId);
      if (user) {
        user.isSubscribed = true;
        user.membershipType = "premium";
        user.subscriptionExpiresAt = new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000
        );

        await user.save();
      }
    }

    res.status(200).send("Payment processed successfully");
  } catch (error) {
    console.error("Error processing webhook:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = paymentRoutes;
