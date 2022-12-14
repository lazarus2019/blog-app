const expressAsyncHandler = require("express-async-handler");
const Post = require("../../model/post/Post");
const validateMongodbId = require("../../utils/validateMongodbID");
const Filter = require("bad-words");
const User = require("../../model/user/User");
const {
  cloudinaryUploadImg,
  cloudinaryDeleteWithId,
} = require("../../utils/cloudinary");
const { removeFileByPath } = require("../../middlewares/uploads/photoUpload");
const mongoose = require("mongoose");
const { getPublicId } = require("../../utils/uploadFile");
const blockUser = require("../../utils/blockUser")

//// Create post
const createPostCtrl = expressAsyncHandler(async (req, res) => {
  const { _id } = req.user;

  blockUser(req?.user);

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
      image: imgUploaded?.url,
    });

    res.json(post);
    await removeFileByPath(localPath);
  } catch (error) {
    res.json(error);
  }
});

//// Fetch all posts
const fetchPostsCtrl = expressAsyncHandler(async (req, res) => {
  const hasCategory = req.query.category;
  try {
    // Check if pass category in querystring
    if (hasCategory) {
      const posts = await Post.find({ category: hasCategory })
        .populate("user")
        .sort("-createdAt"); // join with user
      res.json(posts);
    } else {
      const posts = await Post.find({}).populate("user").sort("-createdAt"); // join with user
      res.json(posts);
    }
  } catch (error) {
    res.json(error);
  }
});

//// Fetch a single post
const fetchPostCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);

  try {
    const post = await Post.findById(id)
      .populate("user")
      .populate("disLikes")
      .populate("likes") // join with user, disLikes and likes
      .populate("comments"); // get comments from virtual populate
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
    // https://stackoverflow.com/questions/64029169/findoneanddelete-mongoose-not-working-mern-stack
    const post = await Post.findOneAndDelete({
      _id: new mongoose.Types.ObjectId(id),
    });
    cloudinaryDeleteWithId(getPublicId(post?.image));
    res.json(post);
  } catch (error) {
    res.json(error);
  }
});

//// Likes
const toggleAddLikeToPostCtrl = expressAsyncHandler(async (req, res) => {
  // 1. Find the post to like
  const { postId } = req.body;
  validateMongodbId(postId);
  const post = await Post.findById(postId);

  // 2. Find the login user
  const loginUserId = req?.user?._id;

  // 3. Check if this user has like this post
  const alreadyLiked = post?.likes.find(
    (userId) => userId?.toString() === loginUserId?.toString()
  );

  // 4. Check if this user has dislikes this post
  const alreadyDisliked = post?.disLikes.find(
    (userId) => userId?.toString() === loginUserId?.toString()
  );

  // 5. Remove the user from dislikes array if exists
  if (alreadyDisliked) {
    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $pull: { disLikes: loginUserId },
      },
      { new: true }
    );
  }

  // Toggle
  // Remove the user if he has liked the post
  if (alreadyLiked) {
    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $pull: { likes: loginUserId },
      },
      { new: true }
    );
    res.json(post);
  } else {
    // Add to likes
    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $push: { likes: loginUserId },
      },
      { new: true }
    );
    res.json(post);
  }
});

//// Dislikes
const toggleAddDislikeToPostCtrl = expressAsyncHandler(async (req, res) => {
  // 1. Find the post to be dislike
  const { postId } = req.body;
  validateMongodbId(postId);
  const post = await Post.findById(postId);

  // 2. Find the login user
  const loginUserId = req?.user?._id;

  // 3. Check if this user has dislikes this post
  const alreadyDisliked = post?.disLikes.find(
    (userId) => userId?.toString() === loginUserId?.toString()
  );

  // 4. Check if this user has like this post
  const alreadyLiked = post?.likes.find(
    (userId) => userId?.toString() === loginUserId?.toString()
  );

  // 5. Remove the user from likes array if exists
  if (alreadyLiked) {
    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $pull: { likes: loginUserId },
      },
      { new: true }
    );
  }

  // Toggle
  // Remove the user if he has dislikes the post
  if (alreadyDisliked) {
    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $pull: { disLikes: loginUserId },
      },
      { new: true }
    );
    res.json(post);
  } else {
    // Add to dislikes
    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $push: { disLikes: loginUserId },
      },
      { new: true }
    );
    res.json(post);
  }
});

module.exports = {
  createPostCtrl,
  fetchPostsCtrl,
  fetchPostCtrl,
  updatePostCtrl,
  deletePostCtrl,
  toggleAddLikeToPostCtrl,
  toggleAddDislikeToPostCtrl,
};
