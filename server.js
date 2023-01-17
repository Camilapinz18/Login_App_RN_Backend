const express = require('express')
const mongoose = require('mongoose')
//Se conecta a la bd:
//require('./config/db')
const cors = require('cors');
const app = express()
require('dotenv').config()

app.use(cors());
const PORT = process.env.PORT || 3001
const bcrypt = require('bcrypt')
app.use(express.urlencoded({extended: true}));
app.use(express.json());

/******************** */
const corsOptions = {
  origin: '*',

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

app.post('/api/users/signup', (request, response) => {
  //Extrae las propiedades del req.body y crea nuevas variables independientes
  let { name, email, password, birthDate } = request.body
  name = name.trim()
  email = email.trim()
  password = password.trim()
  birthDate = birthDate.trim()

  if (name === '' || email === '' || password === '' || birthDate === '') {
    response.json({
      status: 'FAILED',
      message: 'Empty input fields!'
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
  else if (password.length < 8) {
    response.json({
      status: 'FAILED',
      message: 'Password is too short'
    })
  } else {
    User.find({ email }).then(result => {
      if (result.length) {
        response.json({
          status: 'FAILED',
          message: 'User already exists!'
        })
      } else {
        console.log('no existe, se procede a crear')

        const saltRounds = 10
        bcrypt.hash(password, saltRounds).then(hashedPassword => {
          const newUser = new User({
            name,
            email,
            password: hashedPassword,
            birthDate
          })

          newUser
            .save()
            .then(result => {
              response.json({
                status: 'OK',
                message: 'User created!',
                data:result
              })
            })
            .catch(error => {
              response.json({
                status: 'FAILED',
                message: 'Error creating a new account'
              })
            })
        })
      }
    })
  }
})
/*********************************************** */

app.post('/api/users/signin', (request, response) => {
  //Extrae las propiedades del req.body y crea nuevas variables independientes
  let { email, password } = request.body
  //console.log('body', request.body)
  email = email.trim()
  password = password.trim()

  if (email === '' || password === '') {
    response.json({
      status: 'FAILED',
      message: 'Empty input fields!'
    })
  } else {
    User.find({ email })
      .then(result => {
        if (result.length) {
          //COMPROBAR CONTRASEÑA:
          const hashedPassword = result[0].password
          bcrypt.compare(password, hashedPassword).then(result => {
            if (result) {
              response.json({
                status: 'OK',
                message: 'Signed IN'
              })
            } else {
              response.json({
                status: 'FAILED',
                message: 'AILED TO Signed IN'
              })
            }
          })

          console.log('hashed', hashedPassword)
        }
      })
      .catch(error => {
        response.json({
          status: 'FAILED',
          message: 'Verirfication failed'
        })
      })
  }
})

/******************************************* */
// app.listen(PORT, () => {
//   console.log('Server running on port', PORT)
// })

module.exports = app
