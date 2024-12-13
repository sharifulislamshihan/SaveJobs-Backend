import { Request, Response } from "express";
import { analyzeData } from "../models/geminiModel";
import { sendResponse } from "../utils/sendResponse";

export const processGeminiRequest = async (req: Request, res: Response): Promise<void> => {
    const { prompt } = req.body;    

    if (!prompt) {
        //res.status(400).json({ error: "Prompt is required." });
        return sendResponse(res, 400, false, "Prompt is required.")
    }

    try {
        console.log(prompt);
        
        const result = await analyzeData(prompt);
        //res.status(200).json({ result });
        return sendResponse(res, 200, true, result)
    } catch (error: any) {
        //res.status(500).json({ error: error.message || "An error occurred." });
        return sendResponse(res, 500, false, error.message)
    }
};