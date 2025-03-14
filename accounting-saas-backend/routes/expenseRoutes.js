// Updated expense router (routes/expenseRoutes.js)
const express = require("express");
const Expense = require("../models/Expense");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// GET all expenses (Protected)
router.get("/", authMiddleware, async (req, res) => {
  try {
    console.log("🛠 Fetching expenses for user:", req.user.userId);
    const expenses = await Expense.find({ userId: req.user.userId });
    console.log("📄 Expenses found:", expenses);
    res.json(expenses);
  } catch (err) {
    console.log("❌ Error fetching expenses:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST create a new expense (Protected)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { category, amount } = req.body;
    
    if (!category || !amount) {
      return res.status(400).json({ msg: "Category and amount are required" });
    }
    
    const newExpense = new Expense({ 
      userId: req.user.userId,
      category, 
      amount 
    });
    
    await newExpense.save();
    console.log("✅ Expense saved:", newExpense);
    res.status(201).json(newExpense);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;