const express = require("express");
const router = express.Router();
const User = require("../models/User"); // Adjust the path if necessary

// Create a new user
router.post("/create", async (req, res) => {
    try {
        const { name, email, emp_code, department, role, is_Admin, is_manager, is_Active, password } = req.body;

        if (!name || !email || !emp_code || !department || !role || !password) {
            return res.status(400).json({ message: "Required fields are missing" });
        }

        // Check if email or emp_code already exists
        const existingUser = await User.findOne({ $or: [{ email }, { emp_code }] });
        if (existingUser) {
            return res.status(400).json({ message: "User with this email or emp_code already exists" });
        }

        const newUser = new User({
            name,
            email,
            emp_code,
            department,
            role,
            is_Admin: is_Admin || false,
            is_manager: is_manager || false,
            is_Active: is_Active || true,
            password
        });

        const savedUser = await newUser.save();
        res.status(201).json({ message: "User created successfully", user: savedUser });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update user details
router.put("/update/:id", async (req, res) => {
    try {
        const updates = {};
        for (const key in req.body) {
            if (req.body[key] !== undefined) {
                updates[key] = req.body[key];
            }
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ message: "No fields provided for update" });
        }

        const updatedUser = await User.findByIdAndUpdate(req.params.id, updates, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User updated successfully", user: updatedUser });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Login user
router.post("/login", async (req, res) => {
  try {
      const { login, password } = req.body;

      // Validate input
      if (!login || !password) {
          return res.status(400).json({ message: "Login and password are required" });
      }

      // Check if user exists by email or emp_code
      const user = await User.findOne({
          $or: [{ email: login }, { emp_code: login }],
          is_Active: true,
      });

      if (!user) {
          return res.status(404).json({ message: "Invalid credentials or inactive account" });
      }

      // Compare provided password with stored password (plaintext comparison)
      if (user.password !== password) {
          return res.status(401).json({ message: "Invalid credentials" });
      }

      // Successful login
      res.json({ message: "Login successful", user });
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});


// Delete user (make it inactive)
router.delete("/delete/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.is_Active = false;
        await user.save();
        res.json({ message: "User deactivated successfully", user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Fetch all active users
router.get("/fetch", async (req, res) => {
    try {
        const users = await User.find({ is_Active: true });
        res.json({ users });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Fetch user by ID
router.get("/fetch/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
