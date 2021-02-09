const { Router } = require('express')
const Chat = require('../models/Chat')
const Message = require('../models/Message')
const auth = require('../midedleware/auth.middleware')
const User = require('../models/User')
const router = Router()

router.post('/chat/:id/message', auth, async (req, res) => {
    try {
        const currentChat = await Chat.findById(req.params.id)
        console.log(req.userId)
        console.log(req.body.text)
        console.log(currentChat.id)
        
        if(currentChat) {
            const message = await Message.create({author: req.userId, text: req.body.text, chat: currentChat.id})
            console.log(message)
            await Chat.findOneAndUpdate({_id: currentChat.id}, {messages: [...currentChat.messages, message._id]})

        res.send({ message })
        } else {
            res.send({ message: "Chat does not exist!"})
        }
       
    } catch (e){
        console.log(e)
        res.send({ message: "Some fields was wrong!"})
    }
})

router.delete('/chat/:id/message/:mesageId', auth, async (req, res) => {

    try {
    const currentChat = await Chat.findById(req.params.id)

        if(currentChat) {

            const currentMessage = await Message.findById(req.params.mesageId)
            if(currentMessage) {
                await Message.findByIdAndDelete(req.params.mesageId)
                res.send({message : "Message delated!"})
            } else {
                res.send({message : "Message does not exist!"})
            }
        } else {
            res.send({ message: "Chat does not exist!"})
        }
    } catch (e) {
        console.log(e)
        res.send({ message: "Some fields was wrong!"})
    }
})

router.get("/chat/:id/messages", auth, async(req, res) => {
    try {
        const currentChat = await Chat.findById(req.params.id)
        if(currentChat) {
            const messages = await Chat.findById(req.params.id).populate("messages")
            res.send(messages)
        } else{
            res.send({ message: "Chat does not exist!"})
        }
    } catch (e) {
        console.log(e)
        res.send({ message: "Some fields was wrong!"})
    }
})
module.exports = router