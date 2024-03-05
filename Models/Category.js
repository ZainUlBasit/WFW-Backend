const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const reqStr = {
  type: String,
  required: true,
};

const CategorySchema = new Schema({
  company_id: reqStr,
  categoryname: reqStr,
  shop: reqStr,
});

module.exports = mongoose.model("Category", CategorySchema);
