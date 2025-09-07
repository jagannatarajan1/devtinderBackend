const express = require("express");
const { userAuth } = require("../middlewares/auth");
const chatRoutes = express.Router();
const Chat = require("../models/chat");

chatRoutes.get("/chats/:targetUserId", userAuth, async (req, res) => {
  const { targetUserId } = req.params;
  const userId = req.user.id;
  // Fetch chat history for the target user

  try {
    const chatHistory = await Chat.find({
      participants: { $all: [userId, targetUserId] },
    }).populate("messages.senderId", "firstName lastName");
    res.json(chatHistory);
  } catch (error) {
    console.error("Error fetching chat history:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});
module.exports = chatRoutes;
