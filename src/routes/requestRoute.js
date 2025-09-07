const express = require("express");
const requestRoute = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const sendMail = require("../utils/mail");
// Importing the model
requestRoute.post("/request/:status/:userId", userAuth, async (req, res) => {
  try {
    const status = req.params.status;
    const toUserId = req.params.userId;
    const fromUserId = req.user._id;

    console.log(req.user, fromUserId);
    console.log(status, toUserId, fromUserId);

    // ✅ Validate user existence
    const validateToId = await User.findById(toUserId);
    if (!validateToId) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Validate status
    const validStatuses = ["interested", "ignored"];
    if (!validStatuses.includes(status)) {
      return res.status(400).send("Invalid status");
    }

    // ✅ Check if opposite user already sent an "interested" request
    const existingOpposite = await ConnectionRequest.findOne({
      fromUserId: toUserId,
      toUserId: fromUserId,
      status: "interested",
    });

    if (existingOpposite && status === "interested") {
      // 🔥 Mutual interest → make it a connection
      existingOpposite.status = "accepted";
      await existingOpposite.save();
      return res.json({
        message: "Connection established!",
        connection: existingOpposite,
      });
    }

    // ✅ Check if request already exists (any status)
    const existingConnection = await ConnectionRequest.findOne({
      fromUserId,
      toUserId,
    });

    if (existingConnection) {
      return res.status(400).json({ message: "Request already exists" });
    }

    // ✅ Create new request
    const newRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    });

    console.log(newRequest);
    await newRequest.save();

    // optional: send mail notification
    await sendMail();

    res.json({
      message: "Request sent successfully",
      status,
      toUserId,
      fromUserId,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error: " + err.message);
  }
});

requestRoute.post(
  "/request/review/:status/:userId",
  userAuth,
  async (req, res) => {
    try {
      const myUserId = req.user._id;
      const otherPersonId = req.params.userId;
      const status = req.params.status;
      const validateStatus = ["accepted", "rejected"];
      if (!validateStatus.includes(status)) {
        return res.status(400).json({
          message: "Invalid status",
        });
      }
      const existingRequest = await ConnectionRequest.findOne({
        fromUserId: otherPersonId,
        toUserId: myUserId,
        status: "interested",
      });
      if (!existingRequest) {
        return res.status(404).json({ message: "No such request found" });
      }
      existingRequest.status = status;

      await existingRequest.save();
      res.json({ message: "Request updated successfully" });
    } catch (err) {
      res.status(500).send("Server error" + err.message);
    }
  }
);
module.exports = requestRoute;
