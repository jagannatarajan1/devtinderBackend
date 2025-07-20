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

    const {
      firstName,
      lastName,
      emailId,
      password,
      about,
      profilePic,
      age,
      gender,
      skills,
    } = req.body;
    const passwordHash = await bcrypt.hash(password, 3);
    const sendObj = {
      firstName,
      lastName,
      emailId,
      password: passwordHash,
      skills,
      profilePic:
        profilePic ||
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaqiwrtc2R9MuIS83171xsgtTt81GddweP-g&s",
      about,
      gender: gender || "male",
      age,
    };
    const user = new User(sendObj);
    await user.save();
    console.log("User saved");
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send(error.message);
  }
});
authRoute.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    console.log(req.body);
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
        httpOnly: true,
        secure: true, // ✅ Needed for HTTPS (Ngrok)
        sameSite: "None", // ✅ Required for cross-origin cookies
        maxAge: 7 * 24 * 60 * 60 * 1000, // e.g., 7 days
      });

      res.status(200).json({
        message: "Login successful",
        user,
      });
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
