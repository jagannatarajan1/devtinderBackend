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

    // Generate OTP
    const otpCode = crypto.randomInt(100000, 999999).toString();

    // Store user data in OTP collection temporarily
    await Otp.create({
      emailId,
      otp: otpCode,
      userData: {
        firstName,
        lastName,
        password,
        about,
        profilePic,
        age,
        gender,
        skills,
      },
    });

    console.log(`OTP sent to ${emailId}: ${otpCode}`);
    await sendEmail(
      emailId,
      "Verify your account",
      `Your OTP is ${otpCode}. It expires in 5 minutes.`
    );

    res.status(200).json({
      message: "OTP sent to email. Please verify to complete signup.",
    });
  } catch (error) {
    console.error(error);
    if (!res.headersSent) {
      res.status(500).send(error.message);
    }
  }
});

// ----------------- VERIFY OTP for Signup -----------------
authRoute.post("/verify-otp", async (req, res) => {
  try {
    const { emailId, otp } = req.body;

    const record = await Otp.findOne({ emailId, otp });
    if (!record)
      return res.status(400).json({ message: "Invalid or expired OTP" });

    const userData = record.userData;
    if (!userData)
      return res
        .status(400)
        .json({ message: "User data not found for this OTP" });

    // Hash the password before saving
    const passwordHash = await bcrypt.hash(userData.password, 10);

    const user = new User({
      ...userData,
      emailId,
      password: passwordHash,
      isVerified: true,
      profilePic: userData.profilePic || "https://placehold.co/100x100",
      gender: userData.gender || "male",
    });

    await user.save();
    await Otp.deleteMany({ emailId });

    // Generate JWT token after signup verification
    const token = await user.JwtToken();

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: "Account verified successfully", user });
  } catch (error) {
    console.error(error);
    if (!res.headersSent) {
      res.status(500).send(error.message);
    }
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
    if (!res.headersSent) {
      res.status(500).send(error.message);
    }
  }
});

// ----------------- RESEND OTP -----------------
authRoute.post("/resend-otp", async (req, res) => {
  try {
    const { emailId } = req.body;

    if (!validator.isEmail(emailId))
      return res.status(400).send("Invalid email address");

    // Check if there's an existing OTP record (temporary user data)
    const otpRecord = await Otp.findOne({ emailId });
    if (!otpRecord)
      return res
        .status(400)
        .send("No signup attempt found with this email. Please signup first.");

    // Check if user already exists in main collection (already verified)
    const existingUser = await User.findOne({ emailId });
    if (existingUser)
      return res.status(400).send("User already verified. Please login.");

    // Delete previous OTPs
    await Otp.deleteMany({ emailId });

    // Generate new OTP
    const otpCode = crypto.randomInt(100000, 999999).toString();

    // Save new OTP with the same temporary user data
    await Otp.create({
      emailId,
      otp: otpCode,
      userData: otpRecord.userData,
    });

    await sendEmail(
      emailId,
      "Resend OTP",
      `Your new OTP is ${otpCode}. It expires in 5 minutes.`
    );

    res.status(200).json({ message: "New OTP sent successfully" });
  } catch (error) {
    console.error(error);
    if (!res.headersSent) {
      res.status(500).send("Failed to resend OTP");
    }
  }
});

// ----------------- LOGOUT -----------------
authRoute.post("/logout", (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.send("Logout successful");
});

module.exports = authRoute;
