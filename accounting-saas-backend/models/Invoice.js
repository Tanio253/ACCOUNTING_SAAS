const mongoose = require("mongoose");

const InvoiceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  client: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ["Paid", "Pending"], default: "Pending" },
  createdAt: { type: Date, default: Date.now },
  dueDate: { type: Date, required: true }
});

module.exports = mongoose.model("Invoice", InvoiceSchema);