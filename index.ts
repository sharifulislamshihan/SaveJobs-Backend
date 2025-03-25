import { app } from "./src/app";
import { connectDB } from "./src/config/db";
import { port } from "./src/secret";

app.listen(port, () =>{
    console.log(`Server is running on port ${port}`);
    connectDB();
})