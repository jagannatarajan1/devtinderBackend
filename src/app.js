const express = require("express");
const { userAuth } = require("./middlewares/auth");

const app = express();

// Root route

app.use("/test/1", (req, res) => {
  res.send(
    "Test test test test test1111111111111111 test test test test test test"
  );
});

app.use("/user", userAuth, (req, res, next) => {
  console.log("User route middleware");
  next();
});
app.get("/user", userAuth, (req, res, next) => {
  res.send("User route");
});
// /test route

app.use("/test", (req, res) => {
  res.send(
    "Test test test test test test test test test test test test test test"
  );
});

// Start the server
app.listen(4000, () => {
  console.log("Server is running on port 4000");
});
