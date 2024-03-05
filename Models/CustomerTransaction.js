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

const CustomerTransactionSchema = new Schema({
  customerid: reqStr,
  shop: reqStr,
  date: reqDate,
  billNo: reqNum,
  name: reqStr,
  qty: reqNum,
  unitprice: reqNum,
  purchase: reqNum,
  total: reqNum,
});

module.exports = mongoose.model(
  "CustomerTransaction",
  CustomerTransactionSchema
);
