const mongoose = require("mongoose");

const connectdb = async () => {
  try {
    mongoose.connect(process.env.DATABASE_SECRET);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

module.exports = connectdb;
