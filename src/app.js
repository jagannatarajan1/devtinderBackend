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
  throw new Error("something went wrong");
  next();
});
app.get("/user", userAuth, (req, res, next) => {
  try {
    console.log(req.user);
    res.send("User route");
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});
// /test route

app.use("/", (err, req, res, next) => {
  if (err) {
    res.status(401).send("something went wrong");
  }
});

// Start the server
app.listen(4000, () => {
  console.log("Server is running on port 4000");
});
