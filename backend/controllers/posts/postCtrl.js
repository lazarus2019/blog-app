const expressAsyncHandler = require("express-async-handler");
const Post = require("../../model/post/Post");
const validateMongodbId = require("../../utils/validateMongodbID");
const Filter = require("bad-words");
const User = require("../../model/user/User");
const { cloudinaryUploadImg } = require("../../utils/cloudinary");
const { removeFileByPath } = require("../../middlewares/uploads/photoUpload");

//// Create post
const createPostCtrl = expressAsyncHandler(async (req, res) => {
  const { _id } = req.user;
  //   validateMongodbId(req.body.user);

  // Check for bad words
  const filter = new Filter();
  const isProfane = filter.isProfane(req.body.title, req.body.description);

  // Block use
  if (isProfane) {
    await User.findByIdAndUpdate(
      _id,
      {
        isBlocked: true,
      },
      { new: true }
    );

    throw new Error(
      "Creating Failed cause it contains profane words and you have been blocked"
    );
  }

  const localPath = `public/images/posts/${req.file.filename}`;
  const imgUploaded = await cloudinaryUploadImg(localPath);

  try {
    const post = await Post.create({
      ...req.body,
      user: _id,
      $push: { images: imgUploaded?.url },
    });

    res.json(post);
    await removeFileByPath(localPath);
  } catch (error) {
    res.json(error);
  }
});

//// Fetch all posts
const fetchPostsCtrl = expressAsyncHandler(async (req, res) => {
  try {
    const posts = await Post.find({}).populate("user"); // join with user
    res.json(posts);
  } catch (error) {
    res.json(error);
  }
});

//// Fetch a single post
const fetchPostCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);

  try {
    const post = await Post.findById(id).populate("user"); // join with user
    // Update number of views
    await Post.findByIdAndUpdate(id, {
      $inc: { numViews: 1 },
    });
    res.json(post);
  } catch (error) {
    res.json(error);
  }
});

//// Update post
const updatePostCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);

  try {
    const post = await Post.findByIdAndUpdate(
      id,
      {
        ...req.body,
        user: req.user?._id,
      },
      { new: true }
    );
    res.json(post);
  } catch (error) {
    res.json(error);
  }
});

//// Delete post
const deletePostCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);

  try {
    const post = await Post.findOneAndDelete(id);
    res.json(post);
  } catch (error) {
    res.json(error);
  }
});

module.exports = {
  createPostCtrl,
  fetchPostsCtrl,
  fetchPostCtrl,
  updatePostCtrl,
  deletePostCtrl,
};
