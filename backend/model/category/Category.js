const mongoose = require("mongoose");
const schemaOptions = require("../../config/model/schemaOptions");

const categoryScheme = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  },
  schemaOptions
);

// compile
const Category = mongoose.model("Category", categoryScheme);

module.exports = Category;
