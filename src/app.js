const express = require("express");
const connectdb = require("./config/database");
const cookieParser = require("cookie-parser");
const app = express();
const authRoute = require("./routes/authRoutes");
const profileRoute = require("./routes/profileRoute.js");
const requestRoute = require("./routes/requestRoute.js");
const receiveRoute = require("./routes/receiveRoutes.js");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const corsOptions = {
  origin: "http://localhost:5173", // Allow frontend
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"], // Allow PATCH
  allowedHeaders: ["Content-Type", "Authorization"], // Allow headers
  credentials: true, // Allow cookies if needed
};

app.use(cors(corsOptions));

// Required for handling preflight requests properly
app.options("*", cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use("/", authRoute);
app.use("/", profileRoute);
app.use("/", requestRoute);
app.use("/", receiveRoute);
app.use(express.static(path.join(__dirname, "../client/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

const connectionFunction = async () => {
  try {
    await connectdb();
    console.log("MongoDB Connected");

    app.listen(process.env.PORT, () => {
      console.log("Server is running ");
    });
  } catch (err) {
    console.error(err.message);
    // process.exit(1);
  }
};
connectionFunction();
