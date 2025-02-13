const express = require("express");
const profileRoute = express.Router();
const { userAuth } = require("../middlewares/auth");
const { validateEdit } = require("../utils/validation");
const { validatePassword } = require("../utils/validation");
const bcrypt = require("bcrypt");
profileRoute.get("/profile/view", userAuth, async (req, res) => {
  try {
    console.log(req.user);
    res.send(req.user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error" + error.message);
  }
});

profileRoute.put("/profile/edit", userAuth, async (req, res) => {
  try {
    const user = req.user;

    const isValid = validateEdit(req);
    if (!isValid) {
      return res.status(400).json({ errors: isValid.errors });
    }
    const editingItem = req.body;
    Object.keys(editingItem).forEach((key) => (user[key] = editingItem[key]));
    console.log(editingItem);
    console.log(user);
    console.log(isValid);
    await user.save();

    res.send(user.firstName + "  updated Successfully");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error" + error.message);
  }
});
profileRoute.patch("/profile/forgotPassword", userAuth, async (req, res) => {
  try {
    if (!validatePassword(req)) {
      return res.status(400).json({ errors: validatePassword.errors });
    }
    console.log(validatePassword);
    const user = req.user;
    const newPassword = req.body.password;
    const passwordHash = await bcrypt.hash(newPassword, 3);
    console.log(passwordHash);
    user.password = passwordHash;
    await user.save();
    console.log(user);
    res.send(user.firstName + "Password updated Successfully");
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message);
  }
});
module.exports = profileRoute;
