import express from 'express'
import { deleteFoodHistory, postHistory } from './../controllers/histories.controller.js';
const router = express.Router()

//localhost:5000/api/ingredients
router.post('/', postHistory)

router.delete('/:time', deleteFoodHistory)

export default router