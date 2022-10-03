const expressAsyncHandler = require("express-async-handler");
const Comment = require("../../model/comment/Comment");
const validateMongodbId = require("../../utils/validateMongodbID");
const blockUser = require("../../utils/blockUser");

//// Create
const createCommentCtrl = expressAsyncHandler(async (req, res) => {
  // 1. Get the user
  const user = req.user;
  blockUser(user);
  // 2. Get the postId
  const { postId, description } = req.body;
  validateMongodbId(postId);

  try {
    const comment = await Comment.create({
      post: postId,
      user,
      description,
    });

    res.json(comment);
  } catch (error) {
    res.json(error);
  }
});

//// Fetch all comments
const fetchAllCommentCtrl = expressAsyncHandler(async (req, res) => {
  try {
    const comments = await Comment.find({}).sort("-created");
    res.json(comments);
  } catch (error) {
    res.json(error);
  }
});

//// Fetch single comment
const fetchCommentCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);

  try {
    const comment = await Comment.findById(id);
    res.json(comment);
  } catch (error) {
    res.json(error);
  }
});

//// Update comment
const updateCommentCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const update = await Comment.findByIdAndUpdate(
      id,
      {
        description: req?.body?.description,
      },
      { new: true, runValidators: true }
    );
    res.json(update);
  } catch (error) {
    res.json(update);
  }
});

//// Delete comment
const deleteCommentCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);

  try {
    const comment = await Comment.findByIdAndDelete(id);
    res.json(comment);
  } catch (error) {
    res.json(error);
  }
});

module.exports = {
  createCommentCtrl,
  fetchAllCommentCtrl,
  fetchCommentCtrl,
  updateCommentCtrl,
  deleteCommentCtrl,
};
