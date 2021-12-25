import express from 'express'
import { deleteHistory, getHistory, patchHistory, postHistory } from './../controllers/histories.controller.js';
const router = express.Router()

//localhost:5000/api/ingredients
router.post('/', postHistory)

router.get('/', getHistory)

router.patch('/:id', patchHistory)

router.delete('/:id', deleteHistory)

export default router