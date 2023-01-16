const express=require('express')
const router = express.Router()
const User = require('../models/user')

//Used to encript user passwords:
const bcrypt = require('bcrypt')

router.get('/',(request,response)=>{
    User.find({}.then(users=>response.json(users))).catch(error=>console.log(error))
})

//Esto es igual a :http://localhost:3000/user/signup
// router.post('/signup', (request, response) => {
//   //Extrae las propiedades del req.body y crea nuevas variables independientes
//   const { name, email, password, birthDate } = req.body
//   name = name.trim()
//   email = email.trim()
//   password = password.trim()
//   birthDate = birthDate.trim()

//   if (name === '' || email === '' || password === '' || birthDate === '') {
//     response.json({
//       status: 'FAILED',
//       message: 'Empty input fields!'
//     })
//   } else if (!/[^a-zA-Z]/.test(name)) {
//     //Verifica si el nombre tiene caracteres distintos a letras
//     response.json({
//       status: 'FAILED',
//       message: 'Invalid name entered!'
//     })
//   } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/) {
//     //regular expression that is used to match and validate email addresses.
//     response.json({
//       status: 'FAILED',
//       message: 'Invalid email entered!'
//     })
//   } else if (!new Date(birthDate).getTime()) {
//     response.json({
//       status: 'FAILED',
//       message: 'Invalid birth date entered!'
//     })
//   } else if (password.length < 8) {
//     response.json({
//       status: 'FAILED',
//       message: 'Password is too short'
//     })
//   } else {
//     User.find({ email })
//       .then(result => {
//         if (result) {
//           response.json({
//             status: 'FAILED',
//             message: 'User already exists!'
//           })
//         } else {
//           const saltRounds = 10
//           bcrypt
//             .hash(password, saltRounds)
//             .then(hashedPassword => {
//               const newUser = new User({
//                 name,
//                 email,
//                 password: hashedPassword,
//                 birthDate
//               })

//               newUser.save().then(result=>{
//                 response.json({
//                     status: 'OK',
//                     message: 'Sign-up successful',
//                     data:result
//                   })
//               }).catch(error=>{
//                 response.json({
//                     status: 'FAILED',
//                     message: 'Error creating a new account'
//                   })
//               })
//             })
//             .catch(error => {
//               response.json({
//                 status: 'FAILED',
//                 message: 'Internal password error'
//               })
//             })
//         }
//       })
//       .catch(error => {
//         console.log(error)
//         response.json({
//           status: 'FAILED',
//           message: 'Error retrieving existin user'
//         })
//       })
//   }
// })

router.post('/signin', (request, response) => {
    const content=request.body

})

module.exports = router
