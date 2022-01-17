import express from 'express'
import { patchUser, postPremium, postChangePassword } from '../controllers/user.controller.js'

const router = express.Router()

//localhost:5000/api/users
router.post('/premium/:id', postPremium)

router.post('/change-password/:id', postChangePassword)

router.patch('/:id', patchUser)


export default router