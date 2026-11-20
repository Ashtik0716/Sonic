import { Router } from 'express'
import { forYou } from '../controllers/recommendationController.js'
import { protect } from '../middleware/auth.js'

const router = Router()
router.get('/', protect, forYou)

export default router