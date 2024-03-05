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

const CustomerReturnSchema = new Schema({
  customerid: reqStr,
  customer: reqStr,
  shop: reqStr,
  date: reqDate,
  billNo: reqNum,
  name: reqStr,
  qty: reqNum,
  unitprice: reqNum,
  total: reqNum,
});

module.exports = mongoose.model(
  "CustomerReturn",
  CustomerReturnSchema
);
