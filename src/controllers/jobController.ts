import { Response } from "express";
import { AuthenticatedRequest } from "../customType/types";
import JobModel from "../models/jobModel";
import UserModel, { IUser } from "../models/userModel";
import { sendResponse } from "../utils/sendResponse";
import mongoose from "mongoose";



export const createJobForUser = async (userId: string, jobData: any): Promise<void> => {
    try {
        // Create a new job entry in the Job collection
        // jobData is the result from Gemini
        //console.log("this is the job data", jobData);
        //console.log("this is the user id", userId);


        const newJob = new JobModel(jobData);
        await newJob.save();

        // Add the new job to the users jobs array
        await UserModel.findByIdAndUpdate(userId, {
            $push: { jobs: newJob._id }, // Push the job ID to the user's jobs array
        });


        // //console.log("Getting the Job Data", jobData);
        // //console.log("company from jobData", jobData.company);
        ////console.log("Job created successfully for user with ID:", userId);


    } catch (error: any) {
        console.error("Error saving job data:", error.message);
        throw new Error("Failed to save job data.");
    }
};



// get all the jobs of user

export const getUserJobs = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        // Extract userId from the request parameters
        const userid = req.user?.id;

        //console.log("getting user jobs", userid);
        // Check if userId is valid
        if (!userid) {
            return sendResponse(res, 400, false, "User ID is required");
        }

        // Find the user and populate their jobs
        const user = await UserModel.findById(userid)
            .populate('jobs')
            .exec();

        //console.log("user in the backend fot get users job", user);

        // Handle case where user is not found
        if (!user) {
            return sendResponse(res, 404, false, 'User not found');
        }

        // Return the populated jobs

        return sendResponse(res, 200, true, "Users Job fetched successfully", user.jobs);

    } catch (error) {
        console.error('Error fetching user jobs:', error);
        return sendResponse(res, 500, false, "Server error while fetching jobs");
    }
};


// Get Single Job
export const getSingleJob = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const jobId = req.params.id;
        //console.log("job id in the get single job", jobId);

        const userId = req.user?.id;

        if (!jobId || !userId) {
            return sendResponse(res, 400, false, "Job ID and User ID are required");
        }

        const job = await JobModel.findById(jobId);
        if (!job) {
            return sendResponse(res, 404, false, "Job not found");
        }

        // Ensure the job belongs to the user
        const user = await UserModel.findById(userId);
        if (!user || !user.jobs.includes(new mongoose.Types.ObjectId(jobId))) {
            return sendResponse(res, 403, false, "Unauthorized access to job");
        }

        return sendResponse(res, 200, true, "Job fetched successfully", job);
    } catch (error) {
        console.error("Error fetching job:", error);
        return sendResponse(res, 500, false, "Server error while fetching job");
    }
};



// Delete Single Job
export const deleteJob = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const jobId = req.params.id;
        const userId = req.user?.id;

        if (!jobId || !userId) {
            return sendResponse(res, 400, false, "Job ID and User ID are required");
        }

        const job = await JobModel.findById(jobId);
        if (!job) {
            return sendResponse(res, 404, false, "Job not found");
        }

        // Ensure the job belongs to the user
        const user = await UserModel.findById(userId);
        if (!user || !user.jobs.includes(new mongoose.Types.ObjectId(jobId))) {
            return sendResponse(res, 403, false, "Unauthorized access to job");
        }

        // Delete the job
        await JobModel.findByIdAndDelete(jobId);

        // Remove the job from user's jobs array
        await UserModel.findByIdAndUpdate(userId, {
            $pull: { jobs: jobId },
        });

        return sendResponse(res, 200, true, "Job deleted successfully");
    } catch (error) {
        console.error("Error deleting job:", error);
        return sendResponse(res, 500, false, "Server error while deleting job");
    }
};


// update a job
export const updateJob = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const jobId = req.params.id;
        const userId = req.user?.id;
        const updatedData = req.body;

        if (!jobId || !userId) {
            return sendResponse(res, 400, false, "Job ID and User ID are required");
        }

        const job = await JobModel.findById(jobId);
        if (!job) {
            return sendResponse(res, 404, false, "Job not found");
        }

        // Ensure the job belongs to the user
        const user = await UserModel.findById(userId);
        if (!user || !user.jobs.includes(new mongoose.Types.ObjectId(jobId))) {
            return sendResponse(res, 403, false, "Unauthorized access to job");
        }

        const updatedJob = await JobModel.findByIdAndUpdate(jobId, updatedData, { new: true });
        return sendResponse(res, 200, true, "Job updated successfully", updatedJob);
    } catch (error) {
        console.error("Error updating job:", error);
        return sendResponse(res, 500, false, "Server error while updating job");
    }
};


// delete Multiple
export const deleteMultipleJobs = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { jobIds } = req.body;
        const userId = req.user?.id;

        if (!jobIds || !Array.isArray(jobIds) || jobIds.length === 0 || !userId) {
            return sendResponse(res, 400, false, "Job IDs and User ID are required");
        }

        const user = await UserModel.findById(userId);
        if (!user) {
            return sendResponse(res, 404, false, "User not found");
        }

        // Verify all jobs belong to the user
        const validJobs = jobIds.filter((id: string) => user.jobs.includes(new mongoose.Types.ObjectId(id)));
        if (validJobs.length !== jobIds.length) {
            return sendResponse(res, 403, false, "Unauthorized access to some jobs");
        }

        // Delete jobs
        await JobModel.deleteMany({ _id: { $in: jobIds } });

        // Remove from user's jobs array
        await UserModel.findByIdAndUpdate(userId, {
            $pull: { jobs: { $in: jobIds } },
        });

        return sendResponse(res, 200, true, "Jobs deleted successfully");
    } catch (error) {
        console.error("Error deleting multiple jobs:", error);
        return sendResponse(res, 500, false, "Server error while deleting jobs");
    }
};



// delete All Jobs
export const deleteAllJobs = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return sendResponse(res, 400, false, "User ID is required");
        }

        const user = await UserModel.findById(userId);
        if (!user) {
            return sendResponse(res, 404, false, "User not found");
        }

        // Delete all jobs associated with the user
        await JobModel.deleteMany({ _id: { $in: user.jobs } });

        // Clear user's jobs array
        user.jobs = [];
        await user.save();

        return sendResponse(res, 200, true, "All jobs deleted successfully");
    } catch (error) {
        console.error("Error deleting all jobs:", error);
        return sendResponse(res, 500, false, "Server error while deleting all jobs");
    }
};


// Get Job Statistics for Dashboard
export const getJobStats = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return sendResponse(res, 400, false, "User ID is required");
        }

        const user = await UserModel.findById(userId).populate("jobs");
        if (!user) {
            return sendResponse(res, 404, false, "User not found");
        }

        const jobs = user.jobs as any[];
        const stats = {
            totalJobs: jobs.length,
            applied: jobs.filter((job) => job.status === "Applied").length,
            interviews: jobs.filter((job) => job.status === "Interview Scheduled").length,
            accepted: jobs.filter((job) => job.status === "Accepted").length,
            rejected: jobs.filter((job) => job.status === "Rejected").length,
            pending: jobs.filter((job) => job.status === "Not Applied").length,
        };

        return sendResponse(res, 200, true, "Stats fetched successfully", stats);
    } catch (error) {
        console.error("Error fetching job stats:", error);
        return sendResponse(res, 500, false, "Server error while fetching stats");
    }
};

// Get Upcoming Deadlines and Interviews
export const getUpcomingJobs = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return sendResponse(res, 400, false, "User ID is required");
        }

        const user = await UserModel.findById(userId).populate("jobs");
        if (!user) {
            return sendResponse(res, 404, false, "User not found");
        }

        const jobs = user.jobs as any[];
        const now = new Date();
        const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

        const upcomingDeadlines = jobs
            .filter((job) => job.applicationDeadline && new Date(job.applicationDeadline) <= sevenDaysFromNow && new Date(job.applicationDeadline) >= now)
            .map((job) => ({
                company: job.company,
                position: job.position,
                deadline: job.applicationDeadline,
            }));

        const upcomingInterviews = jobs
            .filter((job) => job.interviewDate && new Date(job.interviewDate) <= threeDaysFromNow && new Date(job.interviewDate) >= now)
            .map((job) => ({
                company: job.company,
                position: job.position,
                interviewDate: job.interviewDate,
            }));

        return sendResponse(res, 200, true, "Upcoming jobs fetched successfully", {
            deadlines: upcomingDeadlines,
            interviews: upcomingInterviews,
        });
    } catch (error) {
        console.error("Error fetching upcoming jobs:", error);
        return sendResponse(res, 500, false, "Server error while fetching upcoming jobs");
    }
};


// Get Monthly Application Trend
export const getMonthlyTrend = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return sendResponse(res, 400, false, "User ID is required");
        }

        const user = await UserModel.findById(userId).populate("jobs");
        if (!user) {
            return sendResponse(res, 404, false, "User not found");
        }

        const jobs = user.jobs as any[];
        const monthlyData: { [key: string]: number } = {};

        // Initialize the last 6 months
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const now = new Date();
        for (let i = 5; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthKey = months[date.getMonth()];
            monthlyData[monthKey] = 0;
        }

        // Count applications per month
        jobs.forEach((job) => {
            const createdAt = new Date(job.createdAt);
            const monthKey = months[createdAt.getMonth()];
            if (monthlyData[monthKey] !== undefined) {
                monthlyData[monthKey]++;
            }
        });

        const trendData = Object.keys(monthlyData).map((month) => ({
            month,
            applications: monthlyData[month],
        }));

        return sendResponse(res, 200, true, "Monthly trend fetched successfully", trendData);
    } catch (error) {
        console.error("Error fetching monthly trend:", error);
        return sendResponse(res, 500, false, "Server error while fetching monthly trend");
    }
};


// Get Jobs by Source
export const getJobsBySource = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return sendResponse(res, 400, false, "User ID is required");
        }

        const user = await UserModel.findById(userId).populate("jobs");
        if (!user) {
            return sendResponse(res, 404, false, "User not found");
        }

        const jobs = user.jobs as any[];
        const sourceData: { [key: string]: number } = {};

        jobs.forEach((job) => {
            const source = job.sourceLink || "Unknown";
            sourceData[source] = (sourceData[source] || 0) + 1;
        });

        const barChartData = Object.keys(sourceData).map((source) => ({
            source,
            jobs: sourceData[source],
        }));

        return sendResponse(res, 200, true, "Jobs by source fetched successfully", barChartData);
    } catch (error) {
        console.error("Error fetching jobs by source:", error);
        return sendResponse(res, 500, false, "Server error while fetching jobs by source");
    }
};