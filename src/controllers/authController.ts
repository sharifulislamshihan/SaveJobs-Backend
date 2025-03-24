import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Request, response, Response } from "express";
import UserModel, { IUser } from "../models/userModel";
import { sendResponse } from "../utils/sendResponse";
import { generateAccessToken, generateRefreshToken, generateVerificationCode } from '../utils/jwtUtils';
import { sendVerificationCodeEmail } from '../utils/sendVerificationCode';


// register and send verification code
export const registerUser = async (req: Request, res: Response) => {
    try {
        const { name, email, password, image } = req.body;


        // Getting error while keeping this regex in the userModel because of hashing password
        // Validate password before hashing
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
        if (!passwordRegex.test(password)) {
            return sendResponse(
                res,
                400,
                false,
                "Password must be at least 6 characters long and include at least one letter and one number"
            );
        }

        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return sendResponse(res, 400, false, "Email already in use");
        }

        const verificationCode = generateVerificationCode();
        const verificationCodeExpiration = new Date(Date.now() + 10 * 60 * 1000);

        // Hash Password AFTER validation
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new UserModel({
            name,
            email,
            password: hashedPassword, // Store hashed password
            image,
            verificationCode,
            verificationCodeExpiration,
            isVerified: false,
            authMethod: "email-password",
        });

        const savedUser = await newUser.save();

        if (!savedUser) {
            return sendResponse(res, 500, false, "Failed to save user");
        }

        // Send verification code
        try {
            await sendVerificationCodeEmail(name, email, verificationCode);
            return sendResponse(res, 201, true, "User created successfully");
        } catch (emailError) {
            console.error("Email sending error:", emailError);
            return sendResponse(res, 201, true, "User created but email verification failed");
        }

    } catch (error) {
        console.error("Register User Error:", {
            message: (error as Error).message,
            stack: (error as Error).stack
        });
        return sendResponse(res, 500, false, `Server Error: ${(error as Error).message}`);
    }
};



// Verify code
export const verifyCode = async (req: Request, res: Response) => {

    try {

        const { email, verificationCode } = req.body;

        console.log(email, verificationCode);

        // Check if required fields are provided
        if (!email || !verificationCode) {
            return sendResponse(res, 400, false, "Email and verification code are required");
        }


        // Find the user in the database
        const user = await UserModel.findOne({
            email: email
        });

        console.log("user status", user);

        console.log("1");

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
    const { email } = req.body;
    console.log("Email for resend verification code", email);
    try {
        // Find the user by email
        const user = await UserModel.findOne({
            email: email
        });

        // Check if user exists
        console.log("User", user);


        if (!user) {
            return sendResponse(res, 404, false, "User not found");
        }

        // Check if the user is already verified
        if (user.isVerified) {
            return sendResponse(res, 400, false, 'User is already verified');
        }

        // Generate a new verification code and update expiration time
        const verificationCode = generateVerificationCode();
        console.log("Verification code in resend", verificationCode);

        user.verificationCode = verificationCode;
        user.verificationCodeExpiration = new Date(Date.now() + 10 * 60 * 1000);

        // Save the updated user data
        await user.save();

        // Send verification email using user's name from database
        await sendVerificationCodeEmail(user.name, email, verificationCode);

        return sendResponse(res, 200, true, "Verification code resent successfully");

    } catch (error) {
        console.error("Resend verification error:", error);
        return sendResponse(res, 500, false, "Failed to resend verification code");
    }
}


// Login

export const login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    try {
        console.log("Login request received");
        console.log("Email", email);
        console.log("Password", password);



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
            secure: process.env.NODE_ENV === 'development',
            maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
        });

        // Log user in checking
        console.log(`User ${user.email} logged in successfully`);

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


// forget password to check user email exists or not
export const forgetPassword = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        console.log("Forget password request received");


        // Check if user exists
        const user = await UserModel.findOne({
            email
        });
        if (!user) {
            return sendResponse(res, 404, false, 'User not found')
        }

        // Generate a new verification code and update expiration time
        const verificationCode = generateVerificationCode();
        user.verificationCode = verificationCode;
        user.verificationCodeExpiration = new Date(Date.now() + 10 * 60 * 1000);

        // Save the updated user data
        await user.save();

        const name = email.split('@')[0];

        // Send verification email using user's name from database
        await sendVerificationCodeEmail(name, email, verificationCode);

        return sendResponse(res, 200, true, "Verification code resent successfully");
    }
    catch (error) {
        console.error(error);
        return sendResponse(res, 500, false, 'Internal server error while forget password')
    }
}


// reset password
export const resetPassword = async (req: Request, res: Response) => {
    try {
        const { email, verificationCode, newPassword } = req.body;

        // Validate new password
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
        if (!passwordRegex.test(newPassword)) {
            return sendResponse(
                res,
                400,
                false,
                "Password must be at least 6 characters long and include at least one letter and one number"
            );
        }

        console.log("Reset password request received");
        console.log("Email", email);
        console.log("Verification Code", verificationCode);
        console.log("New Password", newPassword);


        // Find user and verify code
        const user = await UserModel.findOne({ email });

        if (!user) {
            return sendResponse(res, 404, false, "User not found");
        }

        // Verify the verification code
        if (!user.verificationCode || user.verificationCode !== verificationCode) {
            return sendResponse(res, 400, false, "Invalid verification code");
        }

        // Check if code has expired
        if (!user.verificationCodeExpiration || user.verificationCodeExpiration < new Date()) {
            return sendResponse(res, 400, false, "Verification code has expired");
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password and clear verification data
        user.password = hashedPassword;
        user.verificationCode = null;
        user.verificationCodeExpiration = null;
        await user.save();

        return sendResponse(res, 200, true, "Password reset successfully");

    } catch (error) {
        console.error("Reset Password Error:", error);
        return sendResponse(res, 500, false, "Internal server error while resetting password");
    }
};



// to check user loggedin
export const getMe = async (req: Request, res: Response) => {
    try {
        // Extract user info from request (added by the authenticate middleware)
        const userId = (req as any).user?.id;

        console.log("this is the user id", userId);

        // Check if user ID is present
        if (!userId) {
            return sendResponse(res, 401, false, 'Unauthorized: User not authenticated');
        }

        // Fetch user details from DB
        const user = await UserModel.findById(userId).select('-password'); // Exclude password from response

        if (!user) {
            return sendResponse(res, 404, false, 'User not found');
        }

        // Send user data
        return sendResponse(res, 200, true, 'User retrieved successfully', {
            id: user._id,
            name: user.name,
            email: user.email,
            image: user.image,
        });

    } catch (error) {
        console.error(error);
        return sendResponse(res, 500, false, 'Internal server error while fetching user data');
    }
};