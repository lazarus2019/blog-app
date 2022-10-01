const mongoose = require("mongoose");
const schemaOptions = require("../../config/model/schemaOptions");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Post title is required"],
      trim: true,
    },
    // Create by only category
    category: {
      type: String,
      required: [true, "Post category is required"],
    },
    likes: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    },
    disLikes: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    },
    numViews: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please Author is required"],
    },
    description: {
      type: String,
      required: [true, "Post desciption is required"],
    },
    image: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2022/09/19/15/19/meerkat-7465819_960_720.jpg",
    },
  },
  schemaOptions
);

//populate comments
postSchema.virtual("comments", {
  ref: "Comment",
  foreignField: "post",
  localField: "_id",
});

// compile
const Post = mongoose.model("Post", postSchema);

module.exports = Post;
