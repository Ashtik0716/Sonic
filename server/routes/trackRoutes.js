import { Router } from 'express'
import { trending, search , similar} from '../controllers/trackController.js'

const router = Router()

router.get('/trending', trending)
router.get('/search', search)
router.get('/:id/similar', similar)

export default router