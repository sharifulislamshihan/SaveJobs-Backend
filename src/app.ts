import express, { Express, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import { errorResponse } from "./utils/errorResponse";
import authRouter from "./routes/authRoutes";
import geminiRouter from "./routes/geminiRoutes";
const cors = require('cors');

dotenv.config();

const app: Express = express();


// middleware
app.use(cors());
app.use(express.json());


// Routes
app.use('/auth', authRouter);


app.use('/ai', geminiRouter);



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