const express = require("express");
const receiveRoute = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

const userInfoData = ["firstName", "lastName", "age", "skills", "profilePic"];
receiveRoute.get("/request/receive", userAuth, async (req, res) => {
  try {
    const user = req.user;
    console.log(`Received connection`);
    const connnectionRequest = await ConnectionRequest.find({
      toUserId: user._id,
      status: "interested",
    }).populate("fromUserId", userInfoData);

    console.log(connnectionRequest);
    if (!connnectionRequest) {
      return res.status(404).json({ message: "No connection request found" });
    }
    res.json(connnectionRequest);
  } catch (error) {
    console.error(error.message);
  }
});
receiveRoute.get("/connections", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const connections = await ConnectionRequest.find({
      $or: [
        { toUserId: user, status: "accepted" },
        { fromUserId: user, status: "accepted" },
      ],
    })
      .populate("fromUserId", userInfoData)
      .populate("toUserId", userInfoData);
    const data = connections.map((row) => {
      if (row.fromUserId._id === user._id) {
        return toUserId;
      }
      return row.fromUserId;
    });
    console.log(data);
    res.json(data);
  } catch (error) {
    console.error(error.message);
    res.status(500).send(error.message);
  }
});

module.exports = receiveRoute;
