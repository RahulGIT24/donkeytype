import {Router} from 'express'
import { completeTest, getWords } from '../controllers/type.controller';
import { verifyJWT } from '../middleware/auth.middleware';
import { startTest } from '../controllers/type.controller';

const router = Router()

router.route('/get-words').get(verifyJWT, getWords)
router.route('/start-test').patch(verifyJWT,startTest)
router.route('/complete-test').post(verifyJWT,completeTest)

export default router;