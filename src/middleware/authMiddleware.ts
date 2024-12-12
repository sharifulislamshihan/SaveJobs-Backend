import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwtUtils';
import { jwtSecret } from '../secret';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided.' });
    }

    try {
        const decoded = verifyToken(token, jwtSecret as string);
        (req as any).user = decoded; // Attach user info to request
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token.' });
    }
}