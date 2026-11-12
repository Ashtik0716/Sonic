import { Router } from 'express'
import { searchEverything } from '../controllers/trackController.js'

const router = Router()
router.get('/', searchEverything)

export default router