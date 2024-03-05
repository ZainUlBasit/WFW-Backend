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

const CustomerPaymentSchema = new Schema({
  custid: reqStr,
  name: reqStr,
  cash: reqNum,
  accountno: reqNum,
  date: reqDate,
  description: reqStr,
  shop: reqStr,
});

module.exports = mongoose.model("CustomerPayment", CustomerPaymentSchema);
