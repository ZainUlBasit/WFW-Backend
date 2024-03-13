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

const SalesSchema = new Schema({
  reciept_no: reqNum,
  name: reqStr,
  qty: reqNum,
  price: reqNum,
  purchase: reqNum,
  total: reqNum,
});

module.exports = mongoose.model(
  "sales",
  SalesSchema
);
