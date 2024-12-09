const express = require("express");
const router = express.Router();
const Goal = require("../models/Goals");

// Welcome route
router.get("/", (req, res) => {
    res.json({ message: "Welcome to the Goals API" });
});

// Get all goals
router.get("/fetch", async (req, res) => {
    try {
        const goals = await Goal.find();
        res.json({ goals });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create a new goal
router.post("/create", async (req, res) => {
    try {
        const newGoal = new Goal(req.body);
        const savedGoal = await newGoal.save();
        res.status(201).json({ message: "Goal created successfully", goal: savedGoal });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Update a goal by ID
router.post("/update/:id", async (req, res) => {
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

// Fetch goals by emp_id
router.post("/fetch/:emp_id", async (req, res) => {
    try {
        const { emp_id } = req.params;
        const goals = await Goal.find({ emp_id });
        if (goals.length === 0) {
            return res.status(404).json({ message: "No goals found for the given emp_id" });
        }
        res.json({ goals });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Fetch goals by emp_id and year
router.post("/fetch/:emp_id/:year", async (req, res) => {
    try {
        const { emp_id, year } = req.params;
        const startDate = new Date(`${year}-01-01`);
        const endDate = new Date(`${year}-12-31T23:59:59.999Z`);
        
        const goals = await Goal.find({
            emp_id,
            startDate: { $gte: startDate },
            endDate: { $lte: endDate }
        });

        if (goals.length === 0) {
            return res.status(404).json({ message: "No goals found for the given emp_id and year" });
        }

        res.json({ goals });
    } catch (err) {
        res.status(500).json({ error: err.message });
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
