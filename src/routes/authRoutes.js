const express = require("express");
const authRoute = express.Router();
const { validatorFunction } = require("../utils/validation");

const User = require("../models/user");
const bcrypt = require("bcrypt");
const validator = require("validator");

authRoute.post("/signup", async (req, res) => {
  try {
    validatorFunction(req);
    console.log(req.body);

    const { firstName, lastName, emailId, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 3);
    const sendObj = {
      firstName,
      lastName,
      emailId,
      password: passwordHash,
      // skills: [],
      // profilePic: "",
    };
    const user = new User(sendObj);
    await user.save();
    console.log("User saved");
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error" + error.message);
  }
});
authRoute.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    if (!validator.isEmail(emailId)) {
      throw new Error("Invalid credentials");
    }
    const user = await User.findOne({ emailId });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const AuthenticateUser = await user.ValidatePassword(password);
    if (!AuthenticateUser) {
      throw new Error("Invalid credentials");
    } else {
      const token = await user.JwtToken();

      res.cookie("token", token, {
        expires: new Date(Date.now() + 900000),
        httpOnly: true,
      });
      res.send("login successfully" + user);
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send(error.message);
  }
});
authRoute.post("/logout", (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("logout successfully");
});

module.exports = authRoute;
