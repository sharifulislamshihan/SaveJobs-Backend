import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwtUtils';
import { jwtSecret } from '../secret';
import { sendResponse } from '../utils/sendResponse';
import { AuthenticatedRequest } from '../customType/types';


export const authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>

    if (!token) {
        return sendResponse(res, 401, false, 'Unauthorized: No token provided.');
    }

    try {
        const decoded = verifyToken(token, jwtSecret as string);
        console.log("this is from authRequest",decoded);
        //(req as any).user = decoded; // Attach user info to request
        req.user = decoded as { id: string; name: string; email: string };
        
        next();
    } catch (error) {
        return sendResponse(res, 401, false, 'Unauthorized: Invalid token.')
    }
}