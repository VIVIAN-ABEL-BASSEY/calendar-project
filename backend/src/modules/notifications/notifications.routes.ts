import { Router } from 'express'
import { remindTask } from './notifications.controller'
import { authenticate } from '../../middleware/auth.middleware'

const router = Router()

router.post('/remind', authenticate, remindTask)

export default router