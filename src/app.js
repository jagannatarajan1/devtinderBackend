const express = require("express");
const connectdb = require("./config/database");
const cookieParser = require("cookie-parser");
const app = express();
const authRoute = require("./routes/authRoutes");
const profileRoute = require("./routes/profileRoute.js");
const requestRoute = require("./routes/requestRoute.js");
const receiveRoute = require("./routes/receiveRoutes.js");
const cors = require("cors");
const http = require("http");
const paymentRoutes = require("./routes/paymentRoutes.js");
const initializeSocket = require("./utils/socket.js");
const chatRoutes = require("./routes/chatRoutes.js");
require("dotenv").config();
require("./utils/cronjob.js");

// ✅ CORS configuration
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://devtinder-8uuz.onrender.com",
    "https://devtinderbackend-3v70.onrender.com",
  ],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // ✅ allow sending cookies/headers
};

// ✅ Apply CORS once
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // ✅ handle preflight

// Middlewares
app.use(cookieParser());
app.use(express.json());

// Routes
app.use("/", authRoute);
app.use("/", profileRoute);
app.use("/", requestRoute);
app.use("/", receiveRoute);
app.use("/", paymentRoutes);
app.use("/", chatRoutes);

const server = http.createServer(app);
initializeSocket(server);

// ✅ Connect DB and start server
const connectionFunction = async () => {
  try {
    await connectdb();
    console.log("MongoDB Connected");

    server.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  } catch (err) {
    console.error(err.message);
  }
};
connectionFunction();
