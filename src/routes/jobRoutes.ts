import  express  from 'express';
import { processGeminiRequest } from '../controllers/geminiController';
import { authenticate } from '../middleware/authMiddleware';
import { getUserJobs } from '../controllers/jobController';

const jobRouter = express.Router();


jobRouter.post("/generateJobs", authenticate, processGeminiRequest);
jobRouter.post("/jobs", authenticate, getUserJobs);


export default jobRouter;