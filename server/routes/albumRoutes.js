import { Router } from 'express'
import { popular, getById } from '../controllers/albumController.js'

const router = Router()

// Order matters: "/popular" must come before "/:id"
router.get('/popular', popular)
router.get('/:id', getById)

export default router