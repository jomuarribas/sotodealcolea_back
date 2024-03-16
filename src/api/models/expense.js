const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    memberNumber: { type: String, required: true },
    year: { type: Number, required: true },
    month: { type: String, required: true },
    comunity: { type: Number, required: true },
    cannon: { type: Number, required: true },
    water: { type: Number },
    electricity: { type: Number }
  },
  {
    collection: "expenses"
  }
);

const Expense = mongoose.model("Expense", expenseSchema, "expenses");
module.exports = Expense;