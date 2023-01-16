const express = require('express')
//Se conecta a la bd:
require('./config/db')
const app = express()
const PORT = 3000
const bcrypt = require('bcrypt')
const bodyParser = require('express').json()
app.use(bodyParser)

//const userRouter = require('./api/user')

//app.use(express.json())

//app.use('/user', userRouter)

/********************************* */

const User = require('./models/user')

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

  const newUser = new User({
    name,
    email,
    password,
    birthDate
  })

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
                message: 'User created!'
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

/******************************************* */
app.listen(PORT, () => {
  console.log('Server running on port', PORT)
})

module.exports = app
