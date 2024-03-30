const express = require("express");
const router = express.Router();
const Chatroom = require("../models/chatroom");
const Message = require("../models/message");
const { isAuth } = require("../middlewares/auth");

// Get all chatrooms for the current user
router.get("/chatrooms", isAuth, async (req, res) => {
  try {
    const { user } = req;
    if (!user)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const chatrooms = await Chatroom.find({
      $or: [{ user1: user._id }, { user2: user._id }],
    }).populate("user1 user2 messages");

    return res.json({ success: true, chatrooms });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/chatroom/:id", isAuth, async (req, res) => {
  try {
    const { user } = req;
    if (!user)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const { id } = req.params;
    const chatroom = await Chatroom.findById(id).populate(
      "user1 user2 messages"
    );

    if (!chatroom)
      return res
        .status(404)
        .json({ success: false, message: "Chatroom not found" });

    if (
      chatroom.user1._id.toString() !== user._id.toString() &&
      chatroom.user2._id.toString() !== user._id.toString()
    )
      return res.status(403).json({ success: false, message: "Unauthorized" });

    return res.json({ success: true, chatroom });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.post("/chatroom/:chatroomId/send-message", isAuth, async (req, res) => {
  try {
    const { user } = req;
    if (!user)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const { message } = req.body;
    const { chatroomId } = req.params;

    const chatroom = await Chatroom.findById(chatroomId);
    if (!chatroom)
      return res
        .status(404)
        .json({ success: false, message: "Chatroom not found" });

    if (
      chatroom.user1.toString() !== user._id.toString() &&
      chatroom.user2.toString() !== user._id.toString()
    )
      return res.status(403).json({ success: false, message: "Unauthorized" });

    const newMessage = new Message({
      chatroom: chatroom._id,
      sender: user._id,
      content: message,
      sentAt: new Date(),
    });

    await newMessage.save();
    chatroom.messages.push(newMessage._id);
    await chatroom.save();

    return res.json({ success: true, message: newMessage });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Get all messages for a chatroom
router.get("/chatroom/:id/messages", isAuth, async (req, res) => {
  try {
    const { user } = req;
    if (!user)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const { id } = req.params;
    const chatroom = await Chatroom.findById(id).populate("messages");

    if (!chatroom)
      return res
        .status(404)
        .json({ success: false, message: "Chatroom not found" });

    if (
      chatroom.user1.toString() !== user._id.toString() &&
      chatroom.user2.toString() !== user._id.toString()
    )
      return res.status(403).json({ success: false, message: "Unauthorized" });

    return res.json({ success: true, messages: chatroom.messages });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
