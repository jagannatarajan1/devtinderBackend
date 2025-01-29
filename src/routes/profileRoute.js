const express = require("express");
const profileRoute = express.Router();
const { userAuth } = require("../middlewares/auth");
const { validateEdit } = require("../utils/validation");

profileRoute.get("/profile", userAuth, async (req, res) => {
  try {
    console.log(req.user);
    res.send(req.user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error" + error.message);
  }
});

profileRoute.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    const user = req.user;

    const isValid = validateEdit(req);
    if (!isValid) {
      return res.status(400).json({ errors: isValid.errors });
    }
    const editingItem = req.body;
    const editTheUser = Object.keys(editingItem).forEach(
      (key) => (user[key] = editingItem[key])
    );
    console.log(editTheUser);
    console.log(isValid);
    await user.save();

    res.send("updated Successfully");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error" + error.message);
  }
});
module.exports = profileRoute;
