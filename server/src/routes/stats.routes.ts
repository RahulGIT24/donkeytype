import {Router} from 'express'
import { getAverageStats, getHistory, getResultStats, multiplayerPlayerLeaderBoard, singlePlayerLeaderBoard } from '../controllers/stat.controller'
import { verifyJWT } from '../middleware/auth.middleware'

const router = Router()

router.route("/get-history").get(verifyJWT,getHistory)
router.route("/get-average-stats").get(verifyJWT,getAverageStats)
router.route("/get-result").post(verifyJWT,getResultStats)
router.route("/single-player-leaderboard/:mode/:limit").get(verifyJWT,singlePlayerLeaderBoard)
router.route("/multi-player-leaderboard/:mode/:limit").get(verifyJWT,multiplayerPlayerLeaderBoard)
export default  router