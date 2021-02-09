const express = require("express");
const bcrypt = require('bcrypt');
const config = require('config');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const router = express.Router();

router.post(
    '/register',
    [
        check("email", 'incorrect email').isEmail(),
        check('password', "Password out of correct").isLength({ min: 6})
    ],
     async (req, res) => {
    try {   
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                errors: errors.array(),
                message: 'data is out of correct'
            })
        }
        const { email, password, fullName } = req.body
        const candidate = await User.findOne({email});
        
        if(candidate) {
            return res.status(400).json({ message: 'User already exist '})
        }
        
        
        const hashedPassword = await bcrypt.hash(password, 12)
        
        const user = await User.create({ email, password: hashedPassword, fullName})
        const token = jwt.sign(
            { userId: user.id },
            config.get('jwtSecret'),
            // { expiresIn: '1h' }
            )
        
        await user.save()
        
        res.status(201).json({ token, user})

    } catch (e) {
        res.status(500).json({ message: 'whoops something wrong'})
    }
})

router.post('/login',
[
    check('email', "write correct Email").normalizeEmail().isEmail(),
    check('password', 'write password').exists()
],
 async (req, res) => {
    try {

        const errors = validationResult(req)

        if(!errors.isEmpty()){
            return res.status(400).json({
                errors: errors.array(),
                message: 'data is out of correct login'
            })
        }

        const {email, password } = req.body

        const user = await User.findOne({ email })

        if (!user) {
            return res.status(400).json({ message: 'User not searched'})
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ message: "warning of relevant passvord"})
        }

        const token = jwt.sign(
            { userId: user.id },
            config.get('jwtSecret'),
            // { expiresIn: '1h' }
            )
        
        res.json({ token, user })
    } catch (e) {
        res.status(500).json({ message: 'OOps something wrong'})
    }
})
module.exports = router