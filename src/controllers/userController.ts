import { Request, Response } from 'express';
import { sendResponse } from '../utils/sendResponse';
import UserModel from '../models/userModel';

// Get all users
export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await UserModel.find({}, '-password'); // Exclude password field
        return sendResponse(res, 200, true, "Users retrieved successfully", users);
    } catch (error) {
        console.error("Get All Users Error:", error);
        return sendResponse(res, 500, false, "Error retrieving users");
    }
};

// Get single user by email
export const getUserByEmail = async (req: Request, res: Response) => {
    try {
        const { email } = req.params;
        const user = await UserModel.findOne({ email }, '-password');
        
        if (!user) {
            return sendResponse(res, 404, false, "User not found");
        }

        return sendResponse(res, 200, true, "User retrieved successfully", user);
    } catch (error) {
        console.error("Get User By Email Error:", error);
        return sendResponse(res, 500, false, "Error retrieving user");
    }
};

// Get single user by ID
export const getUserById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = await UserModel.findById(id, '-password');
        
        if (!user) {
            return sendResponse(res, 404, false, "User not found");
        }

        return sendResponse(res, 200, true, "User retrieved successfully", user);
    } catch (error) {
        console.error("Get User By ID Error:", error);
        return sendResponse(res, 500, false, "Error retrieving user");
    }
};