const express = require("express");
const config = require("config");
const mongoose = require("mongoose");
const morgan = require('morgan')


const PORT = config.get("port") || 5000;


const app = express();
app.use(express.json())
app.use(morgan('dev'))
app.use('/api', require('./routes/user.routes')) 
app.use('/api/auth', require('./routes/auth.routes'))

console.log(process.cwd())
async function start() {
  try {
    await mongoose.connect(config.get("mongoUri"), {
    useNewUrlParcer: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    }, (err) => {
    
      err ? console.log('db connection error') : console.log('db connected')
    });
    app.listen(5000, () => console.log(`server is runung on port ${PORT}`));
  } catch (e) {
    console.log("server Error", e.message);
    process.exit(1);
  }
}
start();
