const express = require("express");
const connectdb = require("./config/database");
const User = require("./models/user");

const app = express();
app.use(express.json());
app.post("/signup", async (req, res) => {
  console.log(req.body);
  const user = new User(
    // firstName: "revi",
    // lastName: "kumar",
    // emailId: "raj@gmailddd.com",
    // password: "1234dfdfdf56",
    // age: 45,
    req.body
  );
  try {
    await user.save();
    console.log("User saved");
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

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
