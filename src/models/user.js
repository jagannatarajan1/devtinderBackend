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
          return /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(value);
        },
        message: "Please enter a valid email address.",
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      trim: true,
    },
    age: {
      type: Number,
      required: true,
      min: 18,
      max: 99,
    },
    profilePic: {},
    skills: {
      type: [String],
      required: true,
      minlength: 2,
      maxlength: 10,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userModel);
