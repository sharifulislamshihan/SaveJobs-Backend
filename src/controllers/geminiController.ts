import { Request, Response } from "express";
import { analyzeData } from "../models/geminiModel";
import { sendResponse } from "../utils/sendResponse";
import { createJobForUser } from "./jobController";
import { AuthenticatedRequest } from "../customType/types";

export const processGeminiRequest = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { prompt, id } = req.body;
    console.log("Prompt in the process :", prompt);
    console.log("Id in the process :",id);



    if (!prompt || !id) {
        //res.status(400).json({ error: "Prompt is required." });
        return sendResponse(res, 400, false, "Prompt and id is required.")
    }

    try {
        //console.log(prompt);

        const result = await analyzeData(prompt);

        // Use user information added by the middleware
        //const user = req.user;

        if (!id) {
            return sendResponse(res, 401, false, "User id is missing.");
        }

        console.log("User info in processGeminiRequest id:", id); // Debug log

        // Save the job to the user's document
        await createJobForUser(id, result); // Pass user ID and the generated job data
        //res.status(200).json({ result });
        return sendResponse(res, 200, true, result)
    } catch (error: any) {
        //res.status(500).json({ error: error.message || "An error occurred." });
        return sendResponse(res, 500, false, error.message)
    }
};