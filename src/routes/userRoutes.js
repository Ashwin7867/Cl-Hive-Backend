const express = require("express");
const router = express.Router();
const User = require("../../src/models/User");

// Dummy GET route
router.get("/", (req, res) => {
  res.json({ message: "Welcome to the User API!" });
});

// Dummy POST route to create a user
router.post("/", async (req, res) => {
  const { name, email } = req.body;

  try {
    const newUser = new User({ name, email });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
