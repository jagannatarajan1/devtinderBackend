const validator = require("validator");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userModel = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 20,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 20,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator(value) {
          if (!validator.isEmail(value)) {
            throw new Error("Please enter a valid email address");
          }
        },
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      trim: true,
      validate: {
        validator(value) {
          if (!validator.isStrongPassword(value)) {
            throw new Error(
              "Password must be at least 8 characters long, contain a number, a lowercase letter, an uppercase letter, and a special character"
            );
          }
        },
      },
    },
    age: {
      type: Number,
      // required: true,
      min: 18,
      max: 99,
    },
    profilePic: {
      type: String,
      // required: true,
      default: "https://via.placeholder.com/150",
      validate: {
        validator(value) {
          if (!validator.isURL(value)) {
            throw new Error("Please enter a valid URL for profilePic");
          }
        },
      },
    },
    membershipType: {
      type: String,
      enum: {
        values: ["basic", "premium"],
        message: `{VALUE} is not supported`,
      },
      default: "basic",
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "other"],
        message: `{VALUE} is not supported`,
      },
      required: true,
    },
    skills: {
      type: [String],
      // required: true,
      minlength: 2,
      maxlength: 10,
    },
    about: {
      type: String,
      // required: true,
      trim: true,
      minlength: 10,
      maxlength: 100,
    },
    isSubscribed: { type: Boolean, default: false },
    subscriptionExpiresAt: { type: Date },
    isVerified: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);
userModel.methods.JwtToken = async function () {
  const user = this;
  console.log(user);
  const token = jwt.sign({ id: user._id }, "GhostGopal@123", {
    // expiresIn: "1d", // expires in 24 hours
    expiresIn: "7d",
  });
  return token;
};

userModel.methods.ValidatePassword = async function (userInputPassword) {
  const user = this;
  const AuthenticateUser = await bcrypt.compare(
    userInputPassword,
    user.password
  );
  return AuthenticateUser;
};

module.exports = mongoose.model("User", userModel);
