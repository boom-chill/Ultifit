import express from 'express'
import { patchUser } from '../controllers/user.controller.js'

const router = express.Router()

//localhost:5000/api/auth/login
router.patch('/:id', patchUser)

export default router