import mongoose, { Schema, Document } from 'mongoose';

// Interface for User
export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    isVerified: boolean;
    verificationCode: string | null;
    verificationCodeExpiration: Date | null;
    image: string | null;
    authMethod: "email-password" | "google";
    googleId?: string | null; // Placeholder for Google Sign-In
    jobs: mongoose.Types.ObjectId[]; // Array of Job references
    createdAt: Date;
    updatedAt: Date;
}

// User schema definition
const userSchema: Schema<IUser> = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            minlength: [3, 'Name must be at least 3 characters long'],
            maxlength: [50, 'Name cannot exceed 50 characters'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            match: [
                /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                'Please provide a valid email address',
            ],
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [6, 'Password must be at least 6 characters long'],
            validate: {
                validator: function (value: string) {
                    const mediumPasswordRegex =
                        /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/;
                    return mediumPasswordRegex.test(value);
                },
                message:
                    'Password must be at least 6 characters long and include at least one letter and one number',
            },
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        verificationCode: {
            type: String,
            default: null,
        },
        verificationCodeExpiration: {
            type: Date,
            default: null,
        },
        image: {
            type: String,
            default: null, // No validation
        },
        authMethod: {
            type: String,
            enum: ['email-password', 'google'],
            default: 'email-password',
        },
        googleId: {
            type: String,
            default: null,
        },
        jobs: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Job',
            },
        ],
    },
    { timestamps: true }
);

// Create and export User model
const UserModel = mongoose.model<IUser>('User', userSchema);

export default UserModel;
