import jwt from 'jsonwebtoken';
import { jwtSecret, refreshSecret } from '../secret';


// Generate a JWT token
// export const generateToken = (userId: string) => {
//     return jwt.sign({ userId }, jwtSecret as string, {
//         expiresIn: '1h', // Expiry of 1 hour
//     });
// };


// Generate Access Token login
export const generateAccessToken = (userId: string) => {
    return jwt.sign({ id: userId }, jwtSecret as string, { 
        expiresIn: '15m' 
    });
};


// Generate Refresh Token
export const generateRefreshToken = (userId: string) => {
    return jwt.sign({ id: userId }, refreshSecret as string, { 
        expiresIn: '15d' 
    });
};


// Generate a verification token for email verification
export const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
};


// Verify the JWT token
export const verifyToken = (token: string, JWT_ACCESS_SECRET: string | undefined) => {
    return jwt.verify(token, jwtSecret as string);
};