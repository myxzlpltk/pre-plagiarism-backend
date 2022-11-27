const mongoose = require("mongoose");
const schema = mongoose.Schema;

const UserSchema = new schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  picture: {
    type: String,
    required: true,
  },
  idle: {
    type: Boolean,
    default: true,
    required: true,
  }
}, {timestamps: true});

module.exports = mongoose.model("user", UserSchema);