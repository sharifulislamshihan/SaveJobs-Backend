import  express  from 'express';
import { processGeminiRequest } from '../controllers/geminiController';

const geminiRouter = express.Router();


geminiRouter.post("/gemini", processGeminiRequest);


export default geminiRouter;