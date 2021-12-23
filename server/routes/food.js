import express from 'express'
import { deleteFood, getFood, patchFood, postFood } from './../controllers/food.controller.js'
const router = express.Router()

//localhost:5000/api/foods
router.post('/', postFood)

router.get('/', getFood)

router.patch('/', patchFood)

router.delete('/:id', deleteFood)

export default router