const express = require("express");
const router = express.Router();
const Employee = require("../models/EmployeeDetails"); // Adjust the path as needed

// Create Employee
router.post("/employee", async (req, res) => {
    try {
        const employee = new Employee(req.body);
        const savedEmployee = await employee.save();
        res.status(201).json({ message: "Employee created successfully", data: savedEmployee });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get All Employees
router.post("/employees", async (req, res) => {
    try {
        const employees = await Employee.find();
        res.json({ data: employees });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Employee by ID
router.post("/employee/one/:id", async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }
        res.json({ data: employee });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update Employee
router.put("/employee/:id", async (req, res) => {
    try {
        const updatedEmployee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!updatedEmployee) {
            return res.status(404).json({ message: "Employee not found" });
        }
        res.json({ message: "Employee updated successfully", data: updatedEmployee });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/employee/:emp_id", async (req, res) => {
    try {
      const { emp_id } = req.params;
  
      // Find employee by emp_id
      const employee = await Employee.findOne({ emp_id });
  
      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }
  
      res.status(200).json({ employee });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

// Delete Employee
router.delete("/employee/:id", async (req, res) => {
    try {
        const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
        if (!deletedEmployee) {
            return res.status(404).json({ message: "Employee not found" });
        }
        res.json({ message: "Employee deleted successfully", data: deletedEmployee });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
