const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const DocumentSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    filename: {
      type: String,
      required: true,
    },
    originalFilename: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["processing", "valid", "invalid"],
      default: "processing",
      required: true,
    },
    result: {
      method2: Schema.Types.Mixed,
      method5: Schema.Types.Mixed,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("document", DocumentSchema);
