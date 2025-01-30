const express = require("express");
const requestRoute = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
// Importing the model
requestRoute.post("/request/:status/:userId", userAuth, async (req, res) => {
  try {
    const status = req.params.status;
    const toUserId = req.params.userId;
    const fromUserId = req.user._id;
    console.log(req.user, fromUserId);
    console.log(status, toUserId, fromUserId);

    // Check if the user exists
    const validateToId = await User.findById(toUserId);
    if (!validateToId) {
      return res.status(404).json({ message: "User not found" });
    }

    //chech the status
    const validateStatus = ["interested", "ignored"];
    if (!validateStatus.includes(status)) {
      return res.status(400).send("invalid  status");
    }
    const existingconnection = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });
    if (existingconnection) {
      return res.status(400).json({ message: "Request already exists" });
    }

    const newRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    });
    console.log(newRequest);
    await newRequest.save();
    res.json({ status: status, toUserId: toUserId, fromUserId: fromUserId });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server error" + err.message);
  }
});
module.exports = requestRoute;
