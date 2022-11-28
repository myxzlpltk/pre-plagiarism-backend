const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const UserSchema = new Schema(
  {
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
    },
    jobCreatedAt: {
      type: Date,
      get: (v) => {
        return v ? v.getTime() : v;
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", UserSchema);