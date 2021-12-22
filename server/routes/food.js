import express from 'express'
import { getFood, postFood } from './../controllers/food.controller.js'
const router = express.Router()

//localhost:5000/api/foods
router.post('/', postFood)

router.get('/', getFood)

export default router