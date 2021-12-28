import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

import auth from './routes/auth.js'
import fileSystem from './routes/fileSystem.js'
import user from './routes/user.js'
import foodIngredient from './routes/foodIngredient.js'
import food from './routes/food.js'
import exercise from './routes/exercise.js'
import session from './routes/session.js'
import histories from './routes/histories.js'

const app = express()
const PORT =  5000

const localURI = 'mongodb://localhost:27017/ultifit'

mongoose.connect(localURI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => {

    console.log("connected to DB")

    app.listen(PORT, () => {
        console.log(`running server on port ${PORT}`)
    })

  }).catch((err) => {
      console.log(err)
  }
)

//middleware
app.use(express.urlencoded({ extended: true, limit: '50000mb' }))
app.use(express.json({limit: '50000mb' }))
app.use(cors())

//localhost:5000/api/auth
app.use('/api/auth', auth)

//localhost:5000/api/user
app.use('/api/users', user)

//localhost:5000/api/ingredients
app.use('/api/ingredients', foodIngredient)

//localhost:5000/api/foods
app.use('/api/foods', food)

//localhost:5000/api/exercises
app.use('/api/exercises', exercise)

//localhost:5000/api/sessions
app.use('/api/sessions', session)

//localhost:5000/api/histories
app.use('/api/histories', histories)

//localhost:5000/api/file-system
app.use('/file', fileSystem)

