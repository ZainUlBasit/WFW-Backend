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

const CategorySchema = new Schema({
  company_id: reqStr,
  name: reqStr,
  branch: reqNum,
});

module.exports = mongoose.model("Category", CategorySchema);
