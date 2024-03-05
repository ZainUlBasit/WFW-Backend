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

const tItemSchema = new Schema({
  itemname: reqStr,
  itemdate: reqDate,
});

module.exports = mongoose.model("Titem", tItemSchema);
