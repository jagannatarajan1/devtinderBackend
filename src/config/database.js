const mongoose = require("mongoose");

// const mongodb+srv://nodejslearn:O2ouIRi5dIZeHekS@nodejslearn.1ki56.mongodb.net/
const connectdb = async () => {
  try {
    mongoose.connect(
      "mongodb+srv://nodejslearn:O2ouIRi5dIZeHekS@nodejslearn.1ki56.mongodb.net/devTinder"
    );
    console.log("MongoDB connected");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

module.exports = connectdb;
