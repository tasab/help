const { Router } = require("express")
const User = require('../models/User')
const auth = require("../midedleware/auth.middleware")


const router = Router()

router.post('/user', auth, async (req, res) => {
    try {
        const userId = req.user
        const user = await User.findById(userId);

        res.send(user)
    }
    catch (e) {
        console.log(e)
    }
})
module.exports = router