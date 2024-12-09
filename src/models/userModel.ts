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
    jobHistory: mongoose.Types.ObjectId[]; // Array of Job references
    createdAt: Date;
    updatedAt: Date;
}

// User schema definition
const userSchema: Schema<IUser> = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        isVerified: { type: Boolean, default: false },
        verificationCode: { type: String, default: null },
        verificationCodeExpiration: { type: Date, default: null },
        image: { type: String, default: null },
        authMethod: {
            type: String,
            enum: ["email-password", "google"],
            default: "email-password",
        },
        googleId: { type: String, default: null }, // For Google Sign-In (future scope)
        jobs: [{ type: Schema.Types.ObjectId, ref: 'Job' }],
        jobHistory: [{ type: Schema.Types.ObjectId, ref: 'Job' }],
    },
    { timestamps: true }
);

// Create and export User model
const UserModel = mongoose.model<IUser>('User', userSchema);

export default UserModel;
