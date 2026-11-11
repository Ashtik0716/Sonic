import { Router } from 'express'
import { trending, search } from '../controllers/trackController.js'

const router = Router()

router.get('/trending', trending)
router.get('/search', search)

export default router