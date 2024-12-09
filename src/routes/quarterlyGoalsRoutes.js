const express = require("express");
const router = express.Router();
const QuarterlyGoal = require("../models/QuarterlyGoals"); // Updated to match the model name
const Goals = require("../models/Goals");

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
router.post("/update/:id", async (req, res) => {
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
router.post("/fetch/:emp_id", async (req, res) => {
    try {
        const { emp_id } = req.params;
        const goals = await QuarterlyGoal.find({ emp_id });
        if (goals.length === 0) {
            return res.status(404).json({ message: "No Quarterly goals found for the given emp_id" });
        }  
        res.json({ goals,yearly_goal });
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

        // Fetch all yearly goals for the given employee
        const yearlyGoals = await Goals.find({ 
            emp_id, 
            startDate: { $gte: startDate }, 
            endDate: { $lte: endDate } 
        });

        if (yearlyGoals.length === 0) {
            return res.status(404).json({ message: "No Yearly goals found for the given emp_id and year" });
        }

        // Collect all goals_ids from yearly goals
        const goalsIds = yearlyGoals.map(goal => goal._id.toString());

        // Fetch all quarterly goals linked to these yearly goals
        const quarterlyGoals = await QuarterlyGoal.find({
            emp_id,
            goals_id: { $in: goalsIds },
            startDate: { $gte: startDate },
            endDate: { $lte: endDate },
        });

        // Transform the data into the desired flat structure
        const goals = yearlyGoals.map(yearlyGoal => {
            // Find matching quarterly goals for this yearly goal
            const relatedQuarterlyGoals = quarterlyGoals.filter(qGoal => qGoal.goals_id === yearlyGoal._id.toString());

            // Aggregate quarterly ratings
            const selfRatings = relatedQuarterlyGoals.map(qGoal => qGoal.self_ratings || 0);
            const managerRatings = relatedQuarterlyGoals.map(qGoal => qGoal.manger_rating || 0);


            return {
                title: yearlyGoal.name,
                weightage: yearlyGoal.weightage || null,
                selfRating: Math.floor(selfRatings[0]) || 0,
                managerRating: Math.floor(managerRatings[0]) || 0,
                selfReviewText: "This is the self-review placeholder text. Provide insights about personal achievements and learning outcomes.",
                managerReviewText: "This is the manager review placeholder text. Provide insights about expectations and feedback.",
            };
        });

        // Add an "Overview" item
        goals.push({
            title: "Overview",
            weightage: null,
            selfRating: 4,
            managerRating: 4,
            selfReviewText: "This is the self-review placeholder text. Provide insights about personal achievements and learning outcomes.",
            managerReviewText: "This is the manager review placeholder text. Provide insights about expectations and feedback.",
        });

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
