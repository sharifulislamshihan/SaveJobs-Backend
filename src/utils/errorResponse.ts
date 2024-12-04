import { Response } from "express";


export const errorResponse = (res: Response, { statusCode, message }: { statusCode: number, message: string }) => {
    res.status(statusCode).json({
        error: message,
    });
};