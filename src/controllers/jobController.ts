import JobModel from "../models/jobModel";
import UserModel from "../models/userModel";
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