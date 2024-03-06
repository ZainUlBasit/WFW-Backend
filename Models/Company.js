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

const CompanySchema = new Schema({
  name: reqStr,
  email: reqStr,
  contact: reqStr,
  cnic: reqStr,
  description: reqStr,
  address: reqStr,
  branch: reqNum,
  total: {
    type: Number,
    default: 0,
  },
  paid: {
    type: Number,
    default: 0,
  },
  remaining: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Company", CompanySchema);
