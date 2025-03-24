import  express  from 'express';
import { processGeminiRequest } from '../controllers/geminiController';
import { authenticate } from '../middleware/authMiddleware';
import { deleteAllJobs, deleteJob, deleteMultipleJobs, getJobsBySource, getJobStats, getMonthlyTrend, getSingleJob, getUpcomingJobs, getUserJobs, updateJob } from '../controllers/jobController';

const jobRouter = express.Router();


jobRouter.delete("/user-jobs/multiple", authenticate, deleteMultipleJobs);
jobRouter.delete("/user-jobs/all", authenticate, deleteAllJobs);




jobRouter.get("/user-jobs/stats", authenticate, getJobStats);
jobRouter.get("/user-jobs/upcoming", authenticate, getUpcomingJobs);
jobRouter.get("/user-jobs/monthly-trend", authenticate, getMonthlyTrend);
jobRouter.get("/user-jobs/jobs-by-source", authenticate, getJobsBySource);


jobRouter.post("/generateJobs",authenticate,  processGeminiRequest);
jobRouter.get("/user-jobs", authenticate, getUserJobs);
jobRouter.get("/user-jobs/:id", authenticate, getSingleJob);
jobRouter.put("/user-jobs/:id", authenticate, updateJob);
jobRouter.delete("/user-jobs/:id", authenticate, deleteJob);




export default jobRouter;
