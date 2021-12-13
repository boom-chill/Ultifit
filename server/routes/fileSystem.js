import express from 'express'
import { getFile } from '../controllers/file.controller.js';

const router = express.Router()

//localhost:5000/api/file-system/:id
router.get('/:subFolder/:id', getFile)
export default router