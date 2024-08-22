import {Router} from 'express'
import { getAverageStats, getHistory, getResultStats } from '../controllers/stat.controller'
import { verifyJWT } from '../middleware/auth.middleware'

const router = Router()

router.route("/get-history").get(verifyJWT,getHistory)
router.route("/get-average-stats").get(verifyJWT,getAverageStats)
router.route("/get-result").post(verifyJWT,getResultStats)

export default  router