import {Router} from 'express';
import {login, registerUser, verifyToken,forgotPassword,changePassword, refresh, logoutUser, getUser, profilePic} from "../controllers/user.controller";
import { verifyJWT } from '../middleware/auth.middleware';
const router  = Router();

router.route('/register').post(registerUser)
router.route('/verify').post(verifyToken)
router.route('/login').post(login)
router.route('/forgot-password').post(forgotPassword).put(changePassword)
router.route('/refresh-token').get(refresh)
router.route('/logout-user').get(verifyJWT,logoutUser)
router.route('/get-user').get(verifyJWT,getUser)
router.route('/profilePic').post(verifyJWT,profilePic)

export default router