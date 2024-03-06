const mongoose = require("mongoose");
const {
  mongoReqStr,
  mongoReqNum,
  mongoDefNum,
} = require("../utils/MongoTypes");
const Schema = mongoose.Schema;
// Name
// Contact
// Email
// Password
// Confirm Password
// Cnic
// Address
// Shop

const CustomerSchema = new Schema({
  name: mongoReqStr,
  email: mongoReqStr,
  password: mongoReqStr,
  cnic: mongoReqStr,
  contact: mongoReqStr,
  address: mongoReqStr,
  branch: mongoReqNum,
  ref: mongoReqStr,
  page: mongoReqNum,
  return_amount: mongoDefNum,
  discount: mongoDefNum,
  paid: mongoDefNum,
  remaining: mongoDefNum,
  total: mongoDefNum,
});

module.exports = mongoose.model("Customer", CustomerSchema);
