const socket = require("socket.io");
const crypto = require("crypto");
const Chat = require("../models/chat");
const getSecretRoomId = ({ userId, targetUserId }) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("_"))
    .digest("hex");
};
const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: [
        "http://localhost:5173",
        "https://devtinder-8uuz.onrender.com",
        "https://devtinderbackend-3v70.onrender.com",
      ],
    },
  });

  io.on("connection", async (socket) => {
    socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
      console.log("Socket joined:", { firstName, userId, targetUserId });
      roomId = getSecretRoomId(userId, targetUserId);
      console.log(firstName, "joined room:", roomId);
      socket.join(roomId);
    });
    socket.on(
      "sendMessage",
      async ({ firstName, lastName, userId, targetUserId, text }) => {
        console.log("Socket sent:", socket.id);
        const roomId = getSecretRoomId(userId, targetUserId);
        let chat = await Chat.findOne({
          participants: { $all: [userId, targetUserId] },
        })
        if (!chat) {
          chat = new Chat({
            participants: [userId, targetUserId],
            messages: [],
          });
        }
        chat.messages.push({
          senderId: userId,
          text,
          timestamp: Date.now(),
        });
        await chat.save();
        socket.to(roomId).emit("messageReceived", {
          firstName,
          lastName,
          userId,
          targetUserId,
          text,
        });
        console.log("Message sent to room:", roomId);
        console.log("Message content:", {
          firstName,
          lastName,
          userId,
          targetUserId,
          text,
        });
      }
    );
    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });

  return io;
};
module.exports = initializeSocket;
