const express = require("express");
const {
  createCommentCtrl,
  fetchAllCommentCtrl,
  fetchCommentCtrl,
  updateCommentCtrl,
  deleteCommentCtrl,
} = require("../../controllers/comments/commentCtrl");
const authMiddleware = require("../../middlewares/auth/authMiddleware");

const commentRoutes = express.Router();

commentRoutes.post("/", authMiddleware, createCommentCtrl);

commentRoutes.get("/", authMiddleware, fetchAllCommentCtrl);

commentRoutes.put("/:id", authMiddleware, updateCommentCtrl);

commentRoutes.delete("/:id", authMiddleware, deleteCommentCtrl);

commentRoutes.get("/:id", authMiddleware, fetchCommentCtrl);

module.exports = commentRoutes;
