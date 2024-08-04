import {Router} from 'express';
import {login, registerUser, verifyToken} from "../controllers/user.controller";

const router  = Router();

router.route('/register').post(registerUser)
router.route('/verify').post(verifyToken)
router.route('/login').post(login)

export default router