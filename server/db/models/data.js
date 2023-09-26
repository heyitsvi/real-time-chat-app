const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const dataSchema = new Schema(
  {
    message: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    room: {
      type: String,
      required: true,
    },
    __createdtime__: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Data = mongoose.model("messages", dataSchema);

module.exports = Data;
