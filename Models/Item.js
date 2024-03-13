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

const itemSchema = new Schema({
  code: reqStr,
  name: reqStr,
  companyId: { type: mongoose.Types.ObjectId, ref: "company" },
  category: reqStr,
  subcategory: reqStr,
  unit: reqStr,
  purchase: reqNum,
  sale: reqNum,
  qty: { type: Number, default: 0 },
  branch: reqNum,
  addeddate: { type: Number, default: Math.floor(Date.now() / 1000) },
});

module.exports = mongoose.model("Item", itemSchema);
