import { Router } from 'express'
import { register, login, me } from '../controllers/authController.js'
import { protect } from '../middleware/auth.js'
import {googleLogin} from '../controllers/authController.js'

const router = Router()
router.post('/register', register)
router.post('/login', login)
// protect runs first; if it calls next(), then me runs
router.get('/me', protect, me)
router.post('/google', googleLogin)

export default router