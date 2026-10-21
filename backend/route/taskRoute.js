const express = require("express");
const Task = require("../models/Task")

const router = express.Router();

router.get("/tasks", async (req, res) => {
    try{
        const tasks = await Task.find().sort({ createdAt: -1 });
        res.status(200).json(tasks);
    } catch(error){
        res.status(500).json({
            message: "failed to fetch data",
            error: error.message,
        });
    };
});

router.post("/add", async (req, res) => {
    try{
        const {text} = req.body;
        if(typeof text !== "string" || !text.trim()){
            return res.status(400).json({
                message: "task cannot be empty",
            });
        }

        const newTask = new Task({
            text: text.trim(),
        });

        const savedTask = await newTask.save();

        res.status(201).json(savedTask);
    } catch(error){
        res.status(400).json({
            message: "failed to add task",
            error: error.message,
        });
    }
});

module.exports = router;