import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwtUtils';
import { jwtSecret } from '../secret';
import { sendResponse } from '../utils/sendResponse';
import { AuthenticatedRequest } from '../customType/types';

export const authenticate = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return sendResponse(res, 401, false, 'Unauthorized: No token provided');
        }

        // Extract token
        const token = authHeader.split(' ')[1];

        try {
            // Verify token
            const decoded = verifyToken(token, jwtSecret as string);
            
            // Attach decoded user to request
            req.user = decoded as { 
                id: string; 
                email: string; 
                name: string;
            };
            console.log("user form auth middleware", req.user);
            
            next();
        } catch (error) {
            return sendResponse(res, 401, false, 'Invalid or expired token');
        }
    } catch (error) {
        console.error('Auth Middleware Error:', error);
        return sendResponse(res, 500, false, 'Authentication error');
    }
};