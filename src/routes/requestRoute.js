const express = require("express");
const requestRoute = express.Router();
const { userAuth } = require("../middlewares/auth");
// Importing the model
requestRoute.post("/sendingTheConnection", userAuth, async (req, res) => {
  const user = req.user;
  console.log("sending the connection request");
  res.send(user.firstName + "send the connection request");
});
module.exports = requestRoute;
