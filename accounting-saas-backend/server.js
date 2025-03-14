const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ MongoDB Connection Error:", err));

// Import Routes (ensure filenames match exactly)
const invoiceRoutes = require("./routes/invoiceroutes"); // ✅ Correct casing
const expenseRoutes = require("./routes/expenseRoutes");

const authRoutes = require("./routes/authRoutes");
const cors = require("cors");

app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }));  // Allow frontend to access backend
app.use("/api/auth", authRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/expenses", expenseRoutes);


// Root Route
app.get("/", (req, res) => {
  res.send("Accounting SaaS API is running...");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
