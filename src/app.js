const express = require("express");
const connectdb = require("./config/database");
const User = require("./models/user");
const bcrypt = require("bcrypt");
const validatorFunction = require("./utils/validation");
const validator = require("validator");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");
const app = express();

app.use(cookieParser());
app.use(express.json());
app.post("/signup", async (req, res) => {
  try {
    validatorFunction(req);
    console.log(req.body);

    const { firstName, lastName, emailId, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 1);
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
app.get("/profile", userAuth, async (req, res) => {
  try {
    console.log(req.user);
    res.send(req.user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error" + error.message);
  }
});

app.post("/login", async (req, res) => {
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
    // const AuthenticateUser = await bcrypt.compare(password, user.password);
    if (!AuthenticateUser) {
      throw new Error("Invalid credentials");
    } else {
      // const token = jwt.sign({ id: user._id }, "GhostGopal@123", {
      //   expiresIn: "1d", // expires in 24 hours
      // });
      const token = user.JwtToken();

      res.cookie("token", token, {
        expires: new Date(Date.now() + 900000),
        httpOnly: true,
      });
      res.send("login successfully");
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send(error.message);
  }
});

app.patch("/user/:userId", userAuth, async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;
  try {
    const allowedData = [
      "firstName",
      "lastName",
      "password",
      "skills",
      "profilePic",
    ];
    console.log(req.body);
    const isAllowed = Object.keys(data).every((k) => allowedData.includes(k));
    console.log(isAllowed);
    if (isAllowed) {
      if (data.skills && data.skills.length > 10) {
        throw new Error("Skills should contain more than 10 items");
      }
      const userIdFromReq = userId;
      const updatedDataFromReq = req.body;
      const updatedUser = await User.findByIdAndUpdate(
        userIdFromReq,
        updatedDataFromReq,
        { runValidators: true }
      );
      console.log("User updated");
      res.send(updatedUser);
    } else {
      throw new Error();
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error" + error.message);
  }
});

app.get("/user", userAuth, async (req, res) => {
  try {
    const users = await User.find({ emailId: req.body.email });
    console.log(users);
    res.send(users);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});
app.delete("/user", userAuth, async (req, res) => {
  try {
    const userIdFromReq = req.body.userId;
    const deletedUser = await User.deleteOne({ _id: userIdFromReq });
    console.log("User deleted");
    res.send("deleted Successfully" + deletedUser);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});
const connectionFunction = async () => {
  try {
    await connectdb();
    console.log("MongoDB Connected");

    app.listen(4000, () => {
      console.log("Server is running on port 4000");
    });
  } catch (err) {
    console.error(err.message);
    // process.exit(1);
  }
};
connectionFunction();

// Root route

// Start the server
// connectdb().then(() => {
//   console.log("MongoDB Connected");
//   app.listen(4000, () => {
//     console.log("Server is running on port 4000");
//   });
// });
