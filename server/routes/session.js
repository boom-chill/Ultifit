import express from 'express'
import { postSession, getSession, deleteSession, patchSession } from './../controllers/session.controller.js';
const router = express.Router()

//localhost:5000/api/sessions
router.get('/', getSession)

router.post('/', postSession)

router.patch('/:id', patchSession)

router.delete('/:id', deleteSession)

export default router