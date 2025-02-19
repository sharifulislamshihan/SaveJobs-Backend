import mongoose, { Schema, Document } from 'mongoose';

// Job schema definition
const jobSchema: Schema = new Schema(
    {
        company: { type: String, required: true, default: 'Unknown Company' },
        position: { type: String, required: true, default: 'Position Not Provided' },
        location: { type: String, required: true, default: 'Location Not Provided' },
        employmentType: { type: String, default: 'Full-time' },
        salaryRange: { type: String, default: 'Not Disclosed' },
        expectedSalary: { type: String, default: 'Not Specified' },
        applicationDeadline: {
            type: Date,
            required: true,
            default: null // Set default as null if not provided
        },
        description: { type: String, required: true, default: 'Job Description not provided.' },
        skillsRequired: { type: [String], default: [] },
        keyResponsibilities: { type: [String], default: [] },
        perksAndBenefits: { type: [String], default: [] },
        applicationLink: { type: String, default: '' },
        // Status field indicating the job application state
        status: { 
            type: String, 
            enum: ['Not Applied', 'Applied', 'Interview Scheduled', 'Rejected', 'Accepted'],
            default: 'Not Applied'
        },
        sourceLink: { type: String, default: '' },
        applyLink: { type: String, default: '' },
        instruction: {type: String, default: ''},
        hrEmail: { type: String, default: '' },
        interviewDate: { type: Date, default: null },  // Store interview date if applicable
        notes: {type: String, default: ''},
    },
    { timestamps: true }
);




// Adding indexes to improve query performance
// for future work

jobSchema.index({ status: 1 });  
//helps speed up queries like "Find jobs with status = 'Not Applied'


jobSchema.index({ applicationDeadline: 1 });  
// helps with queries like "Find expired jobs" or "Find jobs with upcoming deadlines"

jobSchema.index({ createdAt: -1 });  
// helps with queries like "Find the latest job postings"

// Create Job model
const JobModel = mongoose.model<Document>('Job', jobSchema);

export default JobModel;
