const express = require('express')
const mongoose = require('mongoose')
//Se conecta a la bd:
//require('./config/db')
const cors = require('cors')
const app = express()
require('dotenv').config()

app.use(cors())
const PORT = process.env.PORT
const bcrypt = require('bcrypt')
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

/******************** */
const corsOptions = {
  origin: '*'
}
/******************************* */
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

//const userRouter = require('./api/user')

//app.use(express.json())

//app.use('/user', userRouter)

/********************************* */

const User = require('./models/user')

app.get('/', (request, response) => {
  User.find({}).then(users => {
    response.json({
      alert: `There are ${users.length} users registered`
    })
  })
})

app.get('/api/users', (request, response) => {
  User.find({}).then(users => {
    response.json(users)
  })
})

app.post('/api/users/signin', (request, response) => {
  let email = request.body.email
  let password = request.body.password
  const body = request.body

  if (email === '' || password === '') {
    response.status(404).json({
      status: 'FAILED',
      message: 'Empty input fields!'
    })
  } else if (password.length < 8) {
    response.json({
      status: 'FAILED',
      message: 'Password is too short'
    })
  } else {
    User.find({ email }).then(result => {
      console.log('result', result)
      if (result.length) {
        const hashedPassword = result[0].password
        console.log('hashed', hashedPassword)
        bcrypt
          .compare(password, hashedPassword)
          .then(result => {
            if (result) {
              response.json({
                status: 'OK',
                message: 'Signed IN'
              })
              console.log('signed in ok')
            } else {
              response.json({
                status: 'FAILED',
                message: 'AILED TO Signed IN'
              })
              console.log('signed in failed')
            }
          })
          .catch(error => {
            console.log('error', error)
            response.json({
              status: 'FAILED',
              message: 'Verirfication failed'
            })
          })
      } else {
        response.json({
          status: 'FAILED',
          message: 'User not found'
        })
        console.log('User not found')
      }
    })
    //response.status(201).json(body)
  }

  console.log('body', body)
})

app.post('/api/users/signup', (request, response) => {
  //Extrae las propiedades del req.body y crea nuevas variables independientes
  let name = request.body.name
  let email = request.body.email
  let password = request.body.password
  let birthDate = request.body.birthDate
  const body = request.body
  console.log('SERVER:', name, email, birthDate, password)

  if (name === '' || email === '' || password === '' || birthDate === '') {
    response.json({
      status: 'FAILED',
      message: 'Empty input fields!'
    })
  } else if (password.length < 8) {
    response.json({
      status: 'FAILED',
      message: 'Password is too short'
    })
  } else {
    User.find({ email }).then(result => {
      console.log('result', result)
      if (result.length) {
        response.json({
          status: 'FAILED',
          message: 'The email is already registered'
        })
      } else {
        const saltRounds = 10
        bcrypt.hash(password, saltRounds).then(hashedPassword => {
          const newUser = new User({
            name,
            email,
            password: hashedPassword,
            birthDate
          })
          console.log(hashedPassword)

          newUser
            .save()
            .then(result => {
              response.json({
                status: 'OK',
                message: 'Sign Up successful',
                data:result
              })
            })
            .catch(error => {
              console.log("error",error)
              response.json({
                status: 'FAILED',
                message: 'Error creating a new account'
              })
            })
        })
      }
    })
  }

  //   } else if (!/[^a-zA-Z]/.test(name)) {
  //     //Verifica si el nombre tiene caracteres distintos a letras
  //     response.json({
  //       status: 'FAILED',
  //       message: 'Invalid name entered!'
  //     })
  //   }

  // else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/) {
  //     //regular expression that is used to match and validate email addresses.
  //     response.json({
  //       status: 'FAILED',
  //       message: 'Invalid email entered!'
  //     })
  //   else if (!new Date(birthDate).getTime()) {
  //     response.json({
  //       status: 'FAILED',
  //       message: 'Invalid birth date entered!'
  //     })
  //   }
  //  
  // }
})
/*********************************************** */

/******************************************* */
// app.listen(PORT, () => {
//   console.log('Server running on port', PORT)
// })

module.exports = app
