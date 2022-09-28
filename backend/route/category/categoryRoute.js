const express = require("express");
const {
  createCategoryCtrl,
  fetchCategoriesCtrl,
  fetchCategoryCtrl,
  updateCategoryCtrl,
  deleteCategoryCtrl,
} = require("../../controllers/category/categoryCtrl");
const authMiddleware = require("../../middlewares/auth/authMiddleware");

const categoryRoutes = express.Router();

categoryRoutes.post("/", authMiddleware, createCategoryCtrl);

categoryRoutes.get("/", authMiddleware, fetchCategoriesCtrl);

categoryRoutes.put("/:id", authMiddleware, updateCategoryCtrl);

categoryRoutes.delete("/:id", authMiddleware, deleteCategoryCtrl);

categoryRoutes.get("/:id", authMiddleware, fetchCategoryCtrl);

module.exports = categoryRoutes;
