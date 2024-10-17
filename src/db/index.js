import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
        console.log(`Database connected!!! HOST: ${connectionInstance.connection.host}`)
        
    } catch (error) {
        console.log("Database connection error", error);
        process.exit(1)
    }
}

export default connectDB