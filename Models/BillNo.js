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

const BillNoSchema = new Schema({
  currentbillno: reqNum,
  shop: reqStr,
});

module.exports = mongoose.model("BillNo", BillNoSchema);
