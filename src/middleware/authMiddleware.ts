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
            return sendResponse(res, 401, false, 'Session expired. Please login again.');
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

            // Check if user ID exists
            if (!req.user?.id) {
                return sendResponse(res, 401, false, 'Access denied. Please login again.');
            }

            //console.log("User authenticated:", req.user);
            
            next();
        } catch (error) {
            // Clear any existing tokens/cookies
            res.clearCookie('refreshToken', {
                httpOnly: true,
                sameSite: 'strict'
            });
            
            return sendResponse(res, 401, false, 'Session invalid. Please login again.');
        }
    } catch (error) {
        console.error('Auth Middleware Error:', error);
        return sendResponse(res, 500, false, 'Authentication failed. Please try again.');
    }
};