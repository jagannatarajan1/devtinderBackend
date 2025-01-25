const mongoose = require("mongoose");
const userModel = new mongoose.Schema({
  firstName: {
    type: String,
  },
  LastName: {
    type: String,
  },
  emailId: {
    type: String,
  },
  password: {
    type: String,
  },
  age: {
    type: Number,
  },
});

const User = mongoose.model("User", userModel);
module.exports = User;
