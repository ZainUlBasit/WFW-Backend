const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reqStr = {
  type: String,
  required: true,
};

const reqNum = {
  type: Number,
  required: true,
};

const reqDate = {
  type: Date,
  required: true,
};

const ExpenseSchema = new Schema({
  date: reqDate,
  desc: reqStr,
  expense: reqNum,
  shop: reqStr,
});

module.exports = mongoose.model("Expense", ExpenseSchema);