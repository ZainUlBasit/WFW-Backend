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

const itemSchema = new Schema({
  itemcode: reqStr,
  itemname: reqStr,
  itemcompany: reqStr,
  itemcategory: reqStr,
  itemsubcategory: reqStr,
  itemunit: reqStr,
  itempurchase: reqNum,
  itemsale: reqNum,
  itemqty: reqNum,
  itemshop: reqStr,
  itemaddeddate: reqDate,
});

module.exports = mongoose.model("Item", itemSchema);
