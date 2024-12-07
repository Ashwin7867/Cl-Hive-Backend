require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Import routes
const userRoutes = require("./src/routes/userRoutes");
const goalsRoutes = require("./src/routes/goalsRoutes");

// Use routes
app.use("/api/users", userRoutes);

app.use("/api/goals",goalsRoutes)

// Connect to MongoDB
// mongoose
//   .connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("Connected to MongoDB"))
//   .catch((err) => console.error("MongoDB connection error:", err));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
