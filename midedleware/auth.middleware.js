const jwt = require("jsonwebtoken")
const config = require("config")
const User = require("../models/User")

module.exports = async (req, res, next) => {
    if (req.method === "OPTIONS") {
        return next()
    }

    try{
        const token = req.headers.authorization.split(" ")[1]
        if(!token) {
            return res.status(401).json({ message: "Unauthorized"})
        }
        const decoded = jwt.verify(token, config.get("jwtSecret")).userId;
        req.userId = decoded
        req.user = await User.findById(decoded)
        next()
    } catch (e) {
        console.log(e)
    }
}