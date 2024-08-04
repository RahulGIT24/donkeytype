import {Router} from 'express';
import {registerUser, verifyToken} from "../controllers/user.controller";

const router  = Router();

router.route('/register').post(registerUser)
router.route('/verify').post(verifyToken)

export default router