import jwt from 'jsonwebtoken';


// Generate a JWT token
export const generateToken = (userId: string) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET as string, {
        expiresIn: '1h', // Expiry of 1 hour
    });
};

// Generate a verification token for email verification
export const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
};

// Verify the JWT token
export const verifyToken = (token: string) => {
    return jwt.verify(token, process.env.JWT_SECRET as string);
};