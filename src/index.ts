import { app } from "./app";
import { connectDB } from "./config/db";
import { port } from "./secret";

app.listen(port, () =>{
    console.log(`Server is running on port ${port}`);
    connectDB();
})