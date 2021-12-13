import express from 'express'
import { getIngredients } from '../controllers/foodIngredient.controller.js'
const router = express.Router()

//localhost:5000/api/ingredients
router.get('/', getIngredients)

export default router