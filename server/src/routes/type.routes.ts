import {Router} from 'express'
import { getWords } from '../controllers/type.controller';

const router = Router()

router.route('/get_words').get(getWords)

export default router;