import  express  from 'express';
import { processGeminiRequest } from '../controllers/geminiController';
import { authenticate } from '../middleware/authMiddleware';

const geminiRouter = express.Router();


geminiRouter.post("/generateJobs", authenticate, processGeminiRequest);


export default geminiRouter;