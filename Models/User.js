const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reqStr = {
  type: String,
  required: true,
};

const UserSchema = new Schema({
  fullName: reqStr,
  email: reqStr,
  password: reqStr,
  role: reqStr,
  pic: reqStr,
});

module.exports = mongoose.model("User", UserSchema);