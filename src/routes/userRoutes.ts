import express from 'express';
import {
    getAllUsers,
    getUserByEmail,
    getUserById
} from '../controllers/userController';

export const userRouter = express.Router();

// Get all users
userRouter.get('/allUser', getAllUsers);

// Get user by email
userRouter.get('/email/:email', getUserByEmail);

// Get user by ID
userRouter.get('/id/:id', getUserById);
