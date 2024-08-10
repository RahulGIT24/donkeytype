import {Router} from 'express'
import { getHistory } from '../controllers/stat.controller'
import { verifyJWT } from '../middleware/auth.middleware'

const router = Router()

router.route("/get-history").get(verifyJWT,getHistory)

export default  router