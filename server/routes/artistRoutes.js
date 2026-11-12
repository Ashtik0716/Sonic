import { Router } from 'express'
import { popular, getById } from '../controllers/artistController.js'

const router = Router()
router.get('/popular', popular) // before /:id
router.get('/:id', getById)

export default router