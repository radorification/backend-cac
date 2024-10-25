import dotenv from "dotenv";
dotenv.config({
    path: "./env"
});
import connectDB from "./db/index.js";
import express from "express";
import {app} from "./app.js"



app.get('/', (req, res) => {
    res.send("<h3>Connection established!</h3>");
})

connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`App is running on port: ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("MongoDB connection error", err);
    
})