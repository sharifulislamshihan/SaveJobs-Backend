import mongoose, { Schema, Document } from 'mongoose';

// Job schema definition
const jobSchema: Schema = new Schema({
    company: { type: String, required: true, default: 'Unknown Company' },
    position: { type: String, required: true, default: 'Position Not Provided' },
    location: { type: String, required: true, default: 'Location Not Provided' },
    employmentType: { type: String, default: 'Full-time' },
    salaryRange: { type: String, default: 'Not Disclosed' },
    expectedSalary: { type: String, default: 'Not Specified' },
    applicationDeadline: { type: Date, required: true, default: 'Deadline Not Provided' },
    description: { type: String, required: true, default: 'Job Description not provided.' },
    skillsRequired: { type: [String], default: [] },
    keyResponsibilities: { type: [String], default: [] },
    perksAndBenefits: { type: [String], default: [] },
    applicationLink: { type: String, default: '' },
    sourceLink: { type: String, default: '' },
    applyLink: { type: String, default: '' },
    hrEmail: { type: String, default: 'hr@company.com' },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

const JobModel = mongoose.model<Document>('Job', jobSchema);

export default JobModel;