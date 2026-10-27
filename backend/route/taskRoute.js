const express = require("express");
const mongoose = require("mongoose");
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

router.post("/update/:id", async (req, res) => {
    try{
        const {id} = req.params;
        const {text} = req.body;

        if(!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid task ID",
            })
        }

        if(typeof text !== "string" || !text.trim()) {
            return res.status(400).json({
                message: "task cannot be empty",
            })
        }

        const updatedTask = await Task.findByIdAndUpdate(
            id,
            {text: text.trim()},
            {new: true, runValidators: true}
        );

        if(!updatedTask) {
            return res.status(404).json({
                message: "task not found",
            })
        }
        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(500).json({
            message: "failed to update task",
            error: error.message,
        })
    }
});

router.delete("/delete/:id", async (req, res) => {
    try{
        const {id} = req.params;

        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                message: "Invalid task ID",
            })
        }

        const deletedTask = await Task.findByIdAndDelete(id);

        if(!deletedTask){
            return res.status(404).json({
                message: "task not found",
            })
        }
        res.status(200).json({
            message: "task deleted successfully",
            id: deletedTask._id,
        });
    } catch (error) {
        res.status(500).json({
            message: "failed to delete task",
            error: error.message,
        })
    }
})

module.exports = router;