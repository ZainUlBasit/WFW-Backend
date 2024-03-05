const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reqStr = {
  type: String,
  required: true,
};

const SubCategorySchema = new Schema({
  company_id: reqStr,
  categoryname: reqStr,
  subcategoryname: reqStr,
  shop: reqStr,
});

module.exports = mongoose.model("SubCategory", SubCategorySchema);
