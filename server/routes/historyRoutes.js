import { Router } from 'express'
import { getHistory, record } from '../controllers/historyController.js'
import { protect } from '../middleware/auth.js'

const router = Router()
router.use(protect)
router.get('/', getHistory)
router.put('/:trackId', record)

export default router