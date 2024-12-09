const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  emp_code: { type: String, required: true, unique: true },
  department: { type: String, required: true },
  role: { type: String, required: true },
  is_Admin: { type: Boolean, default: false },
  is_manager: { type: Boolean, default: false },
  is_Active: { type: Boolean, default: false },
});

module.exports = mongoose.model("User", UserSchema);
