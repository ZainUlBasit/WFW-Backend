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

const SaleReturnSchema = new Schema({
  customerid: reqStr,
  branch: reqNum,
  date: { type: Number, default: Math.floor(Date.now() / 1000) },
  reciept_no: reqNum,
  sales: [{ type: mongoose.Types.ObjectId, required: true, ref: "sales" }],
});

module.exports = mongoose.model("SaleReturn", SaleReturnSchema);
