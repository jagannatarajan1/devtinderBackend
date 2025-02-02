const express = require("express");
const receiveRoute = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

receiveRoute.get("/request/receive", userAuth, async (req, res) => {
  try {
    const user = req.user;
    console.log(`Received connection`);
    const connnectionRequest = await ConnectionRequest.find({
      toUserId: user._id,
      status: "interested",
    }).populate("fromUserId", ["firstName", "lastName"]);

    console.log(connnectionRequest);
    if (!connnectionRequest) {
      return res.status(404).json({ message: "No connection request found" });
    }
    res.json(connnectionRequest);
  } catch (error) {
    console.error(error.message);
  }
});

module.exports = receiveRoute;
