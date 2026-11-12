import { Router } from 'express'
import { protect } from '../middleware/auth.js'
import { getLikes, getLikedTracks, like, unlike } from '../controllers/likeController.js'

const router = Router()

// Every route in this file needs a logged-in user
router.use(protect)

router.get('/', getLikes)
router.put('/:trackId', like)
router.delete('/:trackId', unlike)
router.get('/', getLikes)
router.get('/tracks', getLikedTracks)

export default router