const express = require("express");

const app = express();

// Root route
app.get("/", (req, res) => {
  res.send("Hey man, this is the first server hjhkhkjshjkh");
});

// /test route
app.get("/test", (req, res) => {
  res.send(
    "Test test test test test test test test test test test test test test"
  );
});

// Start the server
app.listen(4000, () => {
  console.log("Server is running on port 4000");
});
