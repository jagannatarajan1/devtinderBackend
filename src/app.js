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
const authRoute = require("./routes/authRoutes");
const profileRoute = require("./routes/profileRoute.js");
const requestRoute = require("./routes/requestRoute.js");
const receiveRoute = require("./routes/receiveRoutes.js");
const cors = require("cors");

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use("/", authRoute);
app.use("/", profileRoute);
app.use("/", requestRoute);
app.use("/", receiveRoute);
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
