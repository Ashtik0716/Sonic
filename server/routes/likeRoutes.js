import { Router } from 'express'
import { getLikes, like, unlike } from '../controllers/likeController.js'
import { protect } from '../middleware/auth.js'

const router = Router()

// Every route in this file needs a logged-in user
router.use(protect)

router.get('/', getLikes)
router.put('/:trackId', like)
router.delete('/:trackId', unlike)

export default router