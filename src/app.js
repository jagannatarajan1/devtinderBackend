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
    res.status(500).send("Server Error" + error.message);
  }
});

app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  try {
    const allowedData = [
      "firstName",
      "lastName",
      "password",
      "skills",
      "profilePic",
    ];
    console.log(req.body);
    const isAllowed = Object.keys(req.body).every((k) =>
      allowedData.includes(k)
    );
    console.log(isAllowed);
    if (isAllowed) {
      if (req.body.skills && req.body.skills.length > 10) {
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

app.get("/user", async (req, res) => {
  try {
    const users = await User.find({ emailId: req.body.email });
    console.log(users);
    res.send(users);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});
app.delete("/user", async (req, res) => {
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
