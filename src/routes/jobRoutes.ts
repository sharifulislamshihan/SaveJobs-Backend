import  express  from 'express';
import { processGeminiRequest } from '../controllers/geminiController';
import { authenticate } from '../middleware/authMiddleware';
import { deleteJob, getSingleJob, getUserJobs, updateJob } from '../controllers/jobController';

const jobRouter = express.Router();


jobRouter.post("/generateJobs",authenticate,  processGeminiRequest);
jobRouter.get("/user-jobs", authenticate, getUserJobs);
jobRouter.get("/user-jobs/:id", authenticate, getSingleJob);
jobRouter.delete("/user-jobs/:id", authenticate, deleteJob);
jobRouter.put("/user-jobs/:id", authenticate, updateJob);


export default jobRouter;
