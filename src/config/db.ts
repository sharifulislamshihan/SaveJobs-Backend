import mongoose, { ConnectOptions } from 'mongoose';
import { mongodbURL } from '../secret';

// Cache the connection to reuse across requests
let cachedConnection: typeof mongoose | null = null;

// Create a function to connect to the MongoDB database
const connectDB = async (options: ConnectOptions = {}): Promise<void> => {
    // If already connected, return the cached connection
    if (cachedConnection) {
        console.log('Using cached MongoDB connection...');
        return;
    }

    try {
        // Define connection options for better performance and optimization
        const defaultOptions: ConnectOptions = {
            serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds if server selection fails
            connectTimeoutMS: 10000, // Timeout after 10 seconds if connection fails
            ...options,
        };

        // Attempt to connect to MongoDB
        cachedConnection = await mongoose.connect(mongodbURL, defaultOptions);
        console.log('MongoDB connected successfully...');

        // Handle connection errors
        mongoose.connection.on('error', (error: Error) => {
            console.error(`DB connection error: ${error.message}`);
            cachedConnection = null; // Reset cache on error
        });

        // Handle disconnection
        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected');
            cachedConnection = null; // Reset cache on disconnect
        });
    } catch (error) {
        console.error('Could not connect to DB due to:', (error as Error).toString());
        cachedConnection = null; // Reset cache on failure
        throw error; // Throw error to stop the app if connection fails
    }
};

// Export the connectDB function
export { connectDB };