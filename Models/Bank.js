const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const reqNum = {
  type: Number,
  required: true,
};
const reqStr = {
  type: String,
  required: true,
};

const BankSchema = new Schema({
  bankname: reqStr,
  accountno: reqNum,
  amount: reqNum,
  shop: reqStr,
});

module.exports = mongoose.model("Bank", BankSchema);
