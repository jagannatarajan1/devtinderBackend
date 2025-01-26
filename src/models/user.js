const validator = require("validator");
const mongoose = require("mongoose");

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
    skills: {
      type: [String],
      // required: true,
      minlength: 2,
      maxlength: 10,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userModel);
