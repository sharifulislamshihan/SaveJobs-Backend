import mongoose, { Schema, Document } from 'mongoose';

// User schema definition
const userSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    verificationCode: { type: String, default: null },
    verificationCodeExpiration: { type: Date, default: null },
    jobs: [{ type: Schema.Types.ObjectId, ref: 'Job' }],
    jobHistory: [{ type: Schema.Types.ObjectId, ref: 'Job' }]
}, { timestamps: true });

const UserModel = mongoose.model<Document>('User', userSchema);

export default UserModel;
