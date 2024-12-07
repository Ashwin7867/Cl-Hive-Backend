const express = require("express");
const router = express.Router();
const Goal = require("../models/Goals");

// Welcome route
router.get("/", (req, res) => {
    res.json({ message: "Welcome to the Goals API" });
});

// Get all goals
router.get("/goals", async (req, res) => {
    try {
        const goals = await Goal.find();
        res.json({ goals });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create a new goal
router.post("/goals", async (req, res) => {
    try {
        const newGoal = new Goal(req.body);
        const savedGoal = await newGoal.save();
        res.status(201).json({ message: "Goal created successfully", goal: savedGoal });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Update a goal by ID
router.put("/goals/:id", async (req, res) => {
    try {
        const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedGoal) {
            return res.status(404).json({ message: "Goal not found" });
        }
        res.json({ message: "Goal updated successfully", goal: updatedGoal });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete a goal by ID
router.delete("/goals/:id", async (req, res) => {
    try {
        const deletedGoal = await Goal.findByIdAndDelete(req.params.id);
        if (!deletedGoal) {
            return res.status(404).json({ message: "Goal not found" });
        }
        res.json({ message: "Goal deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
