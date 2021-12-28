import express from 'express'
import { getExercises } from './../controllers/exercise.controller.js';
const router = express.Router()

//localhost:5000/api/exercises
router.get('/', getExercises)

export default router