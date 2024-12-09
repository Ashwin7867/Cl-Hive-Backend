const express = require("express");
const router = express.Router();
const QuarterlyGoal = require("../models/QuarterlyGoals"); // Updated to match the model name

// Welcome route
router.get("/", (req, res) => {
    res.json({ message: "Welcome to the Quarterly Goals API" });
});

// Get all goals
router.get("/fetch", async (req, res) => {
    try {
        const quarterlyGoals = await QuarterlyGoal.find();
        res.json({ quarterlyGoals });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create a new goal
router.post("/create", async (req, res) => {
    try {
        const newGoal = new QuarterlyGoal(req.body);
        const savedGoal = await newGoal.save();
        res.status(201).json({ message: "Quarterly Goal created successfully", goal: savedGoal });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Update a goal by ID
router.put("/update/:id", async (req, res) => {
    try {
        const updatedGoal = await QuarterlyGoal.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedGoal) {
            return res.status(404).json({ message: "Goal not found" });
        }
        res.json({ message: "Quarterly Goal updated successfully", goal: updatedGoal });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Fetch goals by emp_id
router.get("/fetch/:emp_id", async (req, res) => {
    try {
        const { emp_id } = req.params;
        const goals = await QuarterlyGoal.find({ emp_id });
        if (goals.length === 0) {
            return res.status(404).json({ message: "No Quarterly goals found for the given emp_id" });
        }
        res.json({ goals });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Fetch goals by emp_id and year
router.get("/fetch/:emp_id/:year", async (req, res) => {
    try {
        const { emp_id, year } = req.params;
        const startDate = new Date(`${year}-01-01`);
        const endDate = new Date(`${year}-12-31T23:59:59.999Z`);
        
        const goals = await QuarterlyGoal.find({
            emp_id,
            startDate: { $gte: startDate },
            endDate: { $lte: endDate }
        });

        if (goals.length === 0) {
            return res.status(404).json({ message: "No Quarterly goals found for the given emp_id and year" });
        }

        res.json({ goals });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a goal by ID
router.delete("/delete/:id", async (req, res) => {
    try {
        const deletedGoal = await QuarterlyGoal.findByIdAndDelete(req.params.id);
        if (!deletedGoal) {
            return res.status(404).json({ message: "Goal not found" });
        }
        res.json({ message: "Quarterly Goal deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
