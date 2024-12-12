import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Request, response, Response } from "express";
import UserModel, { IUser } from "../models/userModel";
import { sendResponse } from "../utils/sendResponse";
import { generateAccessToken, generateRefreshToken, generateVerificationCode } from '../utils/jwtUtils';
import { sendVerificationCodeEmail } from '../utils/sendVerificationCode';


// register and send verification code
export const registerUser = async (req: Request, res: Response) => {
    const { name, email, password, image } = req.body;
    try {

        // Check if user already exists
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            // sending response
            return sendResponse(res, 400, false, "Email already in use")
        }


        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 10); //10 salt

        const verificationCode = generateVerificationCode();
        const verificationCodeExpiration = new Date(Date.now() + 10 * 60 * 1000); // Expires in 10 minutes

        // Create new user in DB
        const newUser = new UserModel({
            name,
            email,
            password: hashedPassword,
            image,
            verificationCode,
            verificationCodeExpiration,
            isVerified: false,
            authMethod: "email-password",
        });
        await newUser.save();

        // sending verification code
        sendVerificationCodeEmail(name, email, verificationCode);

    } catch (error) {

    }
}


// Verify code
export const verifyCode = async (req: Request, res: Response) => {

    const { email, verificationCode } = req.body;

    try {

        // Check if required fields are provided
        if (!email || !verificationCode) {
            return sendResponse(res, 400, false, "Email and verification code are required");
        }


        // Find the user in the database
        const user: IUser | null = await UserModel.findOne({ email });

        // Handle user not found
        if (!user) {
            return sendResponse(res, 404, false, "User not found");
        }

        // Check if the verification code has expired
        if (!user.verificationCodeExpiration || user.verificationCodeExpiration < new Date()) {
            return sendResponse(res, 400, false, "Verification code has expired");
        }

        // Check if the verification code matches
        if (user.verificationCode !== verificationCode) {
            return sendResponse(res, 400, false, "Invalid verification code");
        }

        // Set the user as verified and clear verification data
        user.isVerified = true;
        user.verificationCode = null;
        user.verificationCodeExpiration = null;
        await user.save();

        // Send a success response
        return sendResponse(res, 200, true, "User verified successfully");

    } catch (error) {
        console.error("Error in Verify code", error);
        res.status(500).json({ message: 'Server Error' });
    }
}


// Resend Verification code
export const resendVerificationCodeEmail = async (req: Request, res: Response) => {
    const { name, email } = req.body;
    try {
        // Find the user by email
        const user = await UserModel.findOne({ email });
        if (!user) {
            return sendResponse(res, 404, false, "User not found")
        }

        // Check if the user is already verified
        if (user.isVerified) {
            return sendResponse(res, 400, false, 'User is already verified')
        }

        // Generate a new verification code and update expiration time
        const verificationCode = generateVerificationCode();
        user.verificationCode = verificationCode;
        user.verificationCodeExpiration = new Date(Date.now() + 10 * 60 * 1000); // Expire in 10 minutes

        // saving the data
        await user.save();

        // sending verification email again
        sendVerificationCodeEmail(name, email, verificationCode);



    } catch (error) {
        console.error("Error in Resend verification code", error);
        return sendResponse(res, 500, false, 'Server Error.. Send the Email Again')
    }
}



// Login

export const login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    try {
        // Check if user exists
        const user = await UserModel.findOne({ email });
        if (!user) {
            return sendResponse(res, 401, false, 'Invalid email or password')
        }

        // Check if user is verified
        if (!user.isVerified) {
            return sendResponse(res, 403, false, 'Please verify your email before logging in')
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return sendResponse(res, 401, false, 'Invalid email or password')
        }

        // Generate tokens
        const accessToken = generateAccessToken(user._id as string);
        const refreshToken = generateRefreshToken(user._id as string);

        // Set refresh token in cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
        });

        // Send response
        res.status(200).json({
            message: 'Login successful',
            accessToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                image: user?.image,
            },
        });
    } catch (error) {
        console.error(error);
        return sendResponse(res, 500, false, 'Internal server error while loggedin')
    }
};



// Logout

export const logout = async (req: Request, res: Response) => {
    try {
        // Clear the refresh token cookie
        res.clearCookie('refreshToken', {
            httpOnly: true,
            sameSite: 'strict',
        });

        res.status(200).json({ message: 'Logout successful.' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error.', error });
    }
};