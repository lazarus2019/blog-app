const express = require("express");
const {
  createPostCtrl,
  fetchPostCtrl,
  fetchPostsCtrl,
  updatePostCtrl,
  deletePostCtrl,
} = require("../../controllers/posts/postCtrl");
const authMiddleware = require("../../middlewares/auth/authMiddleware");
const {
  photoUpload,
  postImgResize,
} = require("../../middlewares/uploads/photoUpload");

const postRoutes = express.Router();

postRoutes.post(
  "/",
  authMiddleware,
  photoUpload.single("image"),
  postImgResize,
  createPostCtrl
);

postRoutes.get("/", fetchPostsCtrl);

postRoutes.get("/:id", fetchPostCtrl);

postRoutes.put("/:id", authMiddleware, updatePostCtrl);

postRoutes.delete("/:id", authMiddleware, deletePostCtrl);

module.exports = postRoutes;
