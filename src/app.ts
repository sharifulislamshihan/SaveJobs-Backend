import express, { Express, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import { errorResponse } from "./utils/errorResponse";
import authRouter from "./routes/authRoutes";
import jobRouter from "./routes/jobRoutes";
import { userRouter } from "./routes/userRoutes";
const cors = require('cors');

dotenv.config();

const app: Express = express();


// middleware
app.use(cors({
    origin: 'http://localhost:3000', // frontend URL
    credentials: true // using cookies/auth
}));

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