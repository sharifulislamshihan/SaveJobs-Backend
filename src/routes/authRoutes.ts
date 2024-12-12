import express from 'express';
import { login, logout, registerUser, resendVerificationCodeEmail, verifyCode } from '../controllers/authController';


const authRouter = express.Router();

// Register route
authRouter.post('/register', registerUser);

// Verify code route
authRouter.post('/verify', verifyCode);

// Resend verification code route
authRouter.post('/resend-code', resendVerificationCodeEmail);

// Login
authRouter.post('/login', login);
authRouter.post('/logout', logout);

export default authRouter;