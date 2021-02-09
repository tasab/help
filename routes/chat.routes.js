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

router.get("/chat", auth, async (req, res) => {
  try {
    const CurrentUser = await User.findById(req.user.id).populate("chat");
    res.send(CurrentUser.chat);
  } catch (e) {
    console.log(e);
    res.send({ message: "Some field was wrong!" });
  }
});

router.delete("/chat", async (req, res) => {
  try {
    const currentChat = await Chat.findById({ _id: req.body.chatId });
    console.log(currentChat);

    if (currentChat) {
      await Chat.findByIdAndDelete(req.body.chatId);

      res.send({ message: "chat is deleted!" });
    } else {
      res.send({ message: "Chat does not exist!" });
    }
  } catch (e) {
    console.log(e);
    res.send({ message: "Some field was wrong!" });
  }
});

router.put("/chat", auth, async (req, res) => {
  try {
    console.log(req.body.chatId);
    const currentChat = await Chat.findById(req.body.chatId);
    console.log("currentChat");
    if (currentChat) {
      await Chat.findByIdAndUpdate(req.body.chatId, { name: req.body.name });
      res.send({ message: "Chat is updated!" });
    } else {
      res.send({ message: "Chat does not exist!" });
    }
  } catch (e) {
    console.log(e);
    res.send({ message: "Some field was wrong!" });
  }
});

router.get("/chat/:id", auth, async (req, res) => {
  try {
    console.log(req.params.id)
    const CurrentChat = await Chat.findById(req.params.id)

    res.send(CurrentChat);
  } catch (e) {
    console.log(e);
    res.send({ message: "Some field was wrong!" });
  }
});



module.exports = router;
