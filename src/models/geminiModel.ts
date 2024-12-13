import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";
import { geminiApi } from "../secret";
import { geminiPrompt } from "../utils/geminiPrompt";

if (!geminiApi) {
    throw new Error("Gemini API key is missing.");
}

// Initialize Google Generative AI client
const genAI = new GoogleGenerativeAI(geminiApi);

// Define the model
const model: GenerativeModel = genAI.getGenerativeModel({
    model: "gemini-1.5-pro",
});


export const analyzeData = async (inputText: string): Promise<string> => {
    const promptTemplate: string = geminiPrompt.replace("{{input}}", inputText)
    try {
        console.log(promptTemplate);
        
        // Generate content using the model
        const result = await model.generateContent(promptTemplate);

        // Get the message from the result
        const generatedMessage = result?.response?.text() || "Response text unavailable. Try again!";
        console.log(generatedMessage);
        return generatedMessage;
        
    } catch (error: any) {
        console.error("Error contacting Gemini API:", error.message);
        throw new Error("Failed to process request.");
    }
};
