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

const CompanyPaymentSchema = new Schema({
  companyid: reqStr,
  name: reqStr,
  cash: reqNum,
  accountno: reqStr,
  date: reqDate,
  description: reqStr,
  shop: reqStr,
});

module.exports = mongoose.model("CompanyPayment", CompanyPaymentSchema);
