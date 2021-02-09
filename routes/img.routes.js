const express = require("express");
const path = require("path");
const router = express.Router();
const auth = require("../midedleware/auth.middleware");
const User = require("../models/User");
const Chat = require("../models/Chat");
const AWS = require("aws-sdk");
const config = require("config");
const multer = require("multer");
const multerS3 = require('multer-s3')


AWS.config.update({
    secretAccessKey: '238ptI7u+Ai5hwj/9VkA4KJlvNqf90egPqC0vYo5',
    accessKeyId: 'AKIAIGRG6JGY3YM45AEA',
    region: 'us-west-2'
})

const s3 = new AWS.S3()

var upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'node-img',
        key: function (req, file, cb) {
            console.log('1')
            console.log(file);
            cb(null, file.originalname); //use Date.now() for unique file keys
        }
    })
});

router.post("/img/upload", auth, upload.single('name') ,async (req, res) => {
  try {
    
    res.send(req.file.location);
  } catch (e) {
    console.log(e);
    res.send({ message: "Some field was wrong!" });
  }
});

module.exports = router;
