const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema({
    emp_id: { type: String, required: true },
    pre_goals: { type: String },
    self_ratings: { type: Number},
    self_review: { type: String },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    quarter: { type: String},
    manager_id: { type: String, required: true },
    mananger_review: { type : String},
    manger_rating: { type: String },
    goals_id: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("QuarterlyGoal", goalSchema);
