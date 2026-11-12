import { Router } from 'express'
import {
  list, create, getOne, rename, remove, addTrack, removeTrack,
} from '../controllers/playlistController.js'
import { protect } from '../middleware/auth.js'

const router = Router()
router.use(protect) // every playlist route needs a logged-in user

router.get('/', list)
router.post('/', create)
router.get('/:id', getOne)
router.patch('/:id', rename)
router.delete('/:id', remove)
router.put('/:id/tracks/:trackId', addTrack)
router.delete('/:id/tracks/:trackId', removeTrack)

export default router