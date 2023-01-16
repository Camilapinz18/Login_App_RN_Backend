const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()
const PORT = process.env.PORT || 3001
const app = express()

mongoose.set('strictQuery', true)

mongoose
  .connect(process.env.MONGODB_URI)
  .then(result => {
    console.log('Connected to MongoDb')
    app.listen(PORT, () => {
      console.log('Server running on port', PORT)
    })
  })
  .catch(error => console.log(error))
