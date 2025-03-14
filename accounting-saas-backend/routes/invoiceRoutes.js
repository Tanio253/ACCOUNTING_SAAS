const express = require("express");
const Invoice = require("../models/Invoice");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ GET all invoices (Protected)
router.get("/", authMiddleware, async (req, res) => {
    try {
      console.log("🛠 Fetching invoices for user:", req.user.userId);
      const invoices = await Invoice.find({ userId: req.user.userId }); 
      console.log("📄 Invoices found:", invoices);
      
      res.json(invoices);
    } catch (err) {
      console.log("❌ Error fetching invoices:", err.message);
      res.status(500).json({ error: err.message });
    }
  });

// ✅ POST a new invoice (Protected)
router.post("/", authMiddleware, async (req, res) => {
    const { client, amount, dueDate } = req.body;
  
    if (!client || !amount || !dueDate) {
      return res.status(400).json({ msg: "All fields are required" });
    }
  
    try {
      const newInvoice = new Invoice({
        userId: req.user.userId, // Ensure this field is saved!
        client,
        amount,
        dueDate,
      });
  
      await newInvoice.save();
      console.log("✅ Invoice saved:", newInvoice); // Log saved invoice
      res.status(201).json(newInvoice);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

module.exports = router;
