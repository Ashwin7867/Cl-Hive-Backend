const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema({
    name: { type: String, required: true },
    weightage: { type: Number, required: true },
    description: { type: String },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    emp_id: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Goal", goalSchema);
