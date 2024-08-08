import {Router} from 'express';
import {login, registerUser, verifyToken,forgotPassword,changePassword} from "../controllers/user.controller";

const router  = Router();

router.route('/register').post(registerUser)
router.route('/verify').post(verifyToken)
router.route('/login').post(login)
router.route('/forgotpassword').post(forgotPassword).put(changePassword)

export default router