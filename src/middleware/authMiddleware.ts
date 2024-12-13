import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwtUtils';
import { jwtSecret } from '../secret';
import { sendResponse } from '../utils/sendResponse';

interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
        name: string;
    };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>

    if (!token) {
        return sendResponse(res, 401, false, 'Unauthorized: No token provided.');
    }

    try {
        const decoded = verifyToken(token, jwtSecret as string);
        (req as any).user = decoded; // Attach user info to request
        next();
    } catch (error) {
        return sendResponse(res, 401, false, 'Unauthorized: Invalid token.')
    }
}