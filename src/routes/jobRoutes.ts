import  express  from 'express';
import { processGeminiRequest } from '../controllers/geminiController';
import { authenticate } from '../middleware/authMiddleware';
import { deleteAllJobs, deleteJob, deleteMultipleJobs, getSingleJob, getUserJobs, updateJob } from '../controllers/jobController';

const jobRouter = express.Router();


jobRouter.delete("/user-jobs/multiple", authenticate, deleteMultipleJobs);
jobRouter.delete("/user-jobs/all", authenticate, deleteAllJobs);


jobRouter.post("/generateJobs",authenticate,  processGeminiRequest);
jobRouter.get("/user-jobs", authenticate, getUserJobs);
jobRouter.get("/user-jobs/:id", authenticate, getSingleJob);
jobRouter.put("/user-jobs/:id", authenticate, updateJob);
jobRouter.delete("/user-jobs/:id", authenticate, deleteJob);




export default jobRouter;
