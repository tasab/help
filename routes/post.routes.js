const express = require("express");
const router = express.Router();
const auth = require("../midedleware/auth.middleware");
const User = require("../models/User");
const Chat = require("../models/Chat");

router.post("/chat", auth, async (req, res) => {
  try {
    const existedChat = await Chat.findOne({
      users: [req.userId, req.body.userId],
    });
    if (existedChat) {
      res.send({ message: "Chat alredy exist" });
    } else {
      const chat = await Chat.create({
        name: req.body.name,
        users: [req.userId, req.body.userId],
      });
      await User.findOneAndUpdate({ _id: req.body.userId }, { chat: chat.id });
      await User.findOneAndUpdate({ _id: req.userId }, { chat: chat.id });
      res.send({ Chat: chat });
    }
  } catch (e) {
    console.log(e);
    res.send({ message: "Some field was wrong!" });
  }
});