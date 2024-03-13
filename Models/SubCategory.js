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

const SubCategorySchema = new Schema({
  company_id: reqStr,
  category_id: reqStr,
  categoryname: reqStr,
  name: reqStr,
  branch: reqNum,
});

module.exports = mongoose.model("SubCategory", SubCategorySchema);
