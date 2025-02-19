import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { betterAuth } from "better-auth";
import { connectDB } from '../config/db';
import { MongoClient } from 'mongodb';
import { mongodbURL } from '../secret';

const client = new MongoClient(mongodbURL)
const db = client.db()

export const auth = betterAuth({

    database: mongodbAdapter(db),

    emailAndPassword: {
        enabled: true
    },
    // socialProviders: {
    //     github: {
    //         clientId: process.env.GITHUB_CLIENT_ID,
    //         clientSecret: process.env.GITHUB_CLIENT_SECRET,
    //     }
    // },
})