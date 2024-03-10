const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reqStr = {
  type: String,
  required: true,
};

const UserSchema = new Schema({
  name: reqStr,
  email: reqStr,
  password: reqStr,
  role: {
    type: Number,
    enum: [1, 2, 3], // 1: admin, 2: Branch, 3: Customer
    required: true,
  },
  branch: {
    type: Number,
    enum: [1, 2, 3], // 1: Shop 1, 2: Shop 2, 3: Shop 3
  },
});

module.exports = mongoose.model("User", UserSchema);
