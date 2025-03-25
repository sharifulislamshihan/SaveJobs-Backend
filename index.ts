import { app } from "./src/app";
import { connectDB } from "./src/config/db";
import { port } from "./src/secret";

// Start the server only after connecting to MongoDB (for Optimization)
const startServer = async () => {
    try {
        // Connect to MongoDB first
        await connectDB();
        // Start the server
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.error("Failed to start server due to DB connection error:", error);
        process.exit(1); // Exit if connection fails
    }
};

// Call the start function
startServer();