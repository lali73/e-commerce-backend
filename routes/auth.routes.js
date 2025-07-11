import {Router} from 'express';
import {signUp, signIn, forgetPassword, resetPassword,googleAuth} from '../controllers/auth.controller.js';

const authRouter = Router();

authRouter.post('/sign-up',signUp )
authRouter.post('/sign-in',signIn)
authRouter.post('/forgetPassword',forgetPassword)
authRouter.post('/resetPassword',resetPassword)
authRouter.post('/google-auth',googleAuth)

export default authRouter;