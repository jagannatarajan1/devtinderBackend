const express = require("express");
const authRoute = express.Router();
const { validatorFunction } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const validator = require("validator");
const Otp = require("../models/otp");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

// ----------------- SIGNUP (Step 1: Create user + Send OTP) -----------------
authRoute.post("/signup", async (req, res) => {
  try {
    validatorFunction(req);
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

    const existingUser = await User.findOne({ emailId });
    if (existingUser)
      return res.status(400).send("User already exists with this email");

    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
      skills,
      profilePic: profilePic || "https://placehold.co/100x100",
      about,
      gender: gender || "male",
      age,
      isVerified: false,
    });

    // create OTP
    const otpCode = crypto.randomInt(100000, 999999).toString();
    await Otp.create({ emailId, otp: otpCode });
    console.log(`OTP sent to ${emailId}: ${otpCode}`);
    await sendEmail(
      emailId,
      "Verify your account",
      `Your OTP is ${otpCode}. It expires in 5 minutes.`
    );

    res.status(200).json({
      message: "OTP sent to email. Please verify to complete signup.",
    });
    await user.save();
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// ----------------- VERIFY OTP for Signup -----------------
authRoute.post("/verify-otp", async (req, res) => {
  try {
    const { emailId, otp } = req.body;

    const record = await Otp.findOne({ emailId, otp });
    if (!record) return res.status(400).send("Invalid or expired OTP");

    await User.updateOne({ emailId }, { isVerified: true });
    await Otp.deleteMany({ emailId });

    const user = await User.findOne({ emailId });

    res.status(200).json({ message: "Account verified successfully", user });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// ----------------- LOGIN (Password only) -----------------
authRoute.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    if (!validator.isEmail(emailId)) throw new Error("Invalid credentials");

    const user = await User.findOne({ emailId });
    if (!user) throw new Error("Invalid credentials");
    if (!user.isVerified) throw new Error("Please verify your email first");

    const isMatch = await user.ValidatePassword(password);
    if (!isMatch) throw new Error("Invalid credentials");

    const token = await user.JwtToken();

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// ----------------- RESEND OTP -----------------
authRoute.post("/resend-otp", async (req, res) => {
  try {
    const { emailId } = req.body;

    if (!validator.isEmail(emailId))
      return res.status(400).send("Invalid email address");

    const user = await User.findOne({ emailId });
    if (!user) return res.status(400).send("No account found with this email");
    if (user.isVerified)
      return res.status(400).send("User already verified. Please login.");

    await Otp.deleteMany({ emailId });

    const otpCode = crypto.randomInt(100000, 999999).toString();
    await Otp.create({ emailId, otp: otpCode });

    await sendEmail(
      emailId,
      "Resend OTP",
      `Your new OTP is ${otpCode}. It expires in 5 minutes.`
    );

    res.status(200).json({ message: "New OTP sent successfully" });
  } catch (error) {
    res.status(500).send("Failed to resend OTP");
  }
});

// ----------------- LOGOUT -----------------
authRoute.post("/logout", (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.send("Logout successful");
});

module.exports = authRoute;
