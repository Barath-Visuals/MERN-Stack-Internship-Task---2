const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const taskRoute = require("./route/taskRoute");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/", taskRoute);

app.get("/", (req, res) => {
    res.send("Server is running");
});

mongoose
    .connect(process.env.MONGO_URI, { dbName: "to_do_list" }
        
    )
    .then(() => {
        console.log("MongoDB is connected");

        const PORT = 5500;

        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error("MongoDB connection failed:", error.message);
    });