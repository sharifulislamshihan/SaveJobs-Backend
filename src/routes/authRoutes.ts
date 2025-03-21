import express from 'express';
import { forgetPassword, getMe, login, logout, registerUser, resendVerificationCodeEmail, resetPassword, verifyCode } from '../controllers/authController';
import { authenticate } from '../middleware/authMiddleware';


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

// forget password
authRouter.post('/forgetPassword', forgetPassword);
// reset password
authRouter.post('/resetPassword', resetPassword);

// Verify authentication (Protected Route)
authRouter.get('/me', authenticate, getMe);



export default authRouter;