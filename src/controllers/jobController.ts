import { Response } from "express";
import { AuthenticatedRequest } from "../customType/types";
import JobModel from "../models/jobModel";
import UserModel, { IUser } from "../models/userModel";
import { sendResponse } from "../utils/sendResponse";



export const createJobForUser = async (userId: string, jobData: any): Promise<void> => {
    try {
        // Create a new job entry in the Job collection
        // jobData is the result from Gemini
        const newJob = new JobModel(jobData);
        await newJob.save();

        // Add the new job to the user's jobs array
        await UserModel.findByIdAndUpdate(userId, {
            $push: { jobs: newJob._id }, // Push the job ID to the user's jobs array
        });


        // console.log("Getting the Job Data", jobData);
        // console.log("company from jobData", jobData.company);
        //console.log("Job created successfully for user with ID:", userId);


    } catch (error: any) {
        console.error("Error saving job data:", error.message);
        throw new Error("Failed to save job data.");
    }
};



// get all the jobs of user

export const getUserJobs = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        // Extract userId from the request parameters
        const userid  = req.user?.id;
        
        console.log("getting user jobs", userid);
        // Check if userId is valid
        if (!userid) {
            return sendResponse(res, 400, false, "User ID is required");
        }

        // Find the user and populate their jobs
        const user: IUser | null = await UserModel.findById(userid).populate('jobs').exec();

        // Handle case where user is not found
        if (!user) {
            return sendResponse(res, 404, false, 'User not found');
        }

        // Return the populated jobs
        //res.status(200).json({ jobs: user.jobs });
        return sendResponse(res, 200, true,"Users Job fetched successfully", user.jobs);

    } catch (error) {
        console.error('Error fetching user jobs:', error);
        //res.status(500).json({ message: 'Server error', error });
        return sendResponse(res, 500, false,"Server error while fetching jobs");
    }
};