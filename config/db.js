const mongoose = require('mongoose');
require('dotenv').config()

mongoose.set('strictQuery', true)

mongoose
.connect(process.env.MONGODB_URI)
.then(result=>console.log("Connected to MongoDb"))
.catch(error=>console.log(error))

