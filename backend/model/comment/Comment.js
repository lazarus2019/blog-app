const mongoose = require("mongoose");
const schemaOptions = require("../../config/model/schemaOptions");

const commentSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: [true, "Post is required"],
    },
    user: {
      type: Object,
      required: [true, "User is required"],
    },
    description: {
      type: String,
      required: [true, "Comment description is required"],
    },
  },
  schemaOptions
);

// compile
const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
