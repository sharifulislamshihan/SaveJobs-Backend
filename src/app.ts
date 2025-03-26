import express, { Express, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import { errorResponse } from "./utils/errorResponse";
import authRouter from "./routes/authRoutes";
import jobRouter from "./routes/jobRoutes";
import { userRouter } from "./routes/userRoutes";
import cors from 'cors';

dotenv.config();

const app: Express = express();



// app.use(cors({
//     origin: 'https://savejobs.vercel.app', // frontend URL
//     credentials: true, // using cookies/auth
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
//     allowedHeaders: ['Content-Type', 'Authorization']
// }));

// Normalize origins by removing trailing slashes
const normalizeOrigin = (origin: string) => origin.replace(/\/+$/, '');

// Define allowed origins
const allowedOrigins = [
    process.env.FRONTEND_URL || 'https://savejobs.vercel.app',
    'http://localhost:3000', // For local development
].map(normalizeOrigin);

// Handle CORS dynamically
app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true); // Allow requests with no origin (e.g., Postman)
        const normalizedOrigin = normalizeOrigin(origin);
        if (allowedOrigins.includes(normalizedOrigin)) {
            return callback(null, origin); // Use the exact origin sent by the browser
        }
        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Explicitly handle OPTIONS requests to prevent redirects and bypass authentication
app.options('*', (req: Request, res: Response) => {
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || 'https://savejobs.vercel.app');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.status(204).send();
});


// Routes

app.use(express.json());


// Routes
app.use('/auth', authRouter);


app.use('/job', jobRouter);

app.use('/user', userRouter);




app.get("/", (req: Request, res: Response) => {
    res.send("saveJobs server is running....");
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    return errorResponse(res, {
        statusCode: err.status || 500, // Default to 500 if no status provided
        message: err.message || 'Internal Server Error',
    });
});

export {
    app,
}