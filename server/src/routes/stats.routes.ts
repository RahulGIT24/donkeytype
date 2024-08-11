import {Router} from 'express'
import { getAverageStats, getHistory } from '../controllers/stat.controller'
import { verifyJWT } from '../middleware/auth.middleware'

const router = Router()

router.route("/get-history").get(verifyJWT,getHistory)
router.route("/get-average-stats").get(verifyJWT,getAverageStats)

export default  router