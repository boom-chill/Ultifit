import express from 'express'
import { patchUser, postPremium } from '../controllers/user.controller.js'

const router = express.Router()

//localhost:5000/api/users
router.post('/premium/:id', postPremium)

router.patch('/:id', patchUser)


export default router