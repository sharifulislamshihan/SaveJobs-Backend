import mongoose, { ConnectOptions } from 'mongoose';
import { mongodbURL } from '../secret'; 

// Create a function to connect to the MongoDB database
const connectDB = async (options: ConnectOptions = {}): Promise<void> => {
    try {
        // Attempt to connect to MongoDB
        await mongoose.connect(mongodbURL, options);
        console.log('MongoDB connected successfully...');

        // Handle connection errors
        mongoose.connection.on('error', (error: Error) => {
            console.error(`DB connection error: ${error.message}`);
        });
    } catch (error) {
        // If an error occurs, log it
        console.error('Could not connect to DB due to:', (error as Error).toString());
    }
};

// Export the connectDB function
export { connectDB };
