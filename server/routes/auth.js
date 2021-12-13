import express from 'express'
import { postLogin, postRegister, postRegisterInfo } from '../controllers/auth.controller.js'
const router = express.Router()

//localhost:5000/api/auth/login
router.post('/login', postLogin)

//localhost:5000/api/auth/login
router.post('/register', postRegister)

//localhost:5000/api/auth/login
router.post('/register/user-info', postRegisterInfo)

export default router