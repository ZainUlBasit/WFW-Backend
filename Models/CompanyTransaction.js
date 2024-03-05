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

const CompanyTransactionSchema = new Schema({
  company_id: reqStr,
  item_name: reqStr,
  purchase: reqNum,
  qty: reqNum,
  desc: reqStr,
  invoice: reqStr,
  truck: reqStr,
  date: reqDate,
  total: reqNum,
  shop: reqStr,
});

module.exports = mongoose.model("CompanyTransaction", CompanyTransactionSchema);
