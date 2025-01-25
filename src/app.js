const express = require("express");
// const { userAuth } = require("./middlewares/auth");
const connectdb = require("./config/database");

const app = express();

app.get("/", (req, res) => {
  res.send("API is running");
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
