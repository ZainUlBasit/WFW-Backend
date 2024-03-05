const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Name
// Contact
// Email
// Password
// Confirm Password
// Cnic
// Address
// Shop

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

const CustomerSchema = new Schema({
  fullname: reqStr,
  email: reqStr,
  password: reqStr,
  cnic: reqStr,
  contact: reqStr,
  address: reqStr,
  shop: reqStr,
  ref: reqStr,
  page: reqNum,
  discount: reqNum,
  paid: reqNum,
  remaining: reqNum,
  total: reqNum,
  duedate: reqDate,
  returndate: reqDate,
});

module.exports = mongoose.model("Customer", CustomerSchema);
