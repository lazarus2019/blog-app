const express = require("express");
const {
  registerUserCtrl,
  loginUserCtrl,
  fetchUsersCtrl,
  deleteUsersCtrl,
  fetchUserDetailCtrl,
} = require("../../controllers/users/usersCtrl");
const authMiddleware = require("../../middlewares/auth/authMiddleware");

const userRoutes = express.Router();

userRoutes.post("/register", registerUserCtrl);

userRoutes.post("/login", loginUserCtrl);

userRoutes.get("/", authMiddleware, fetchUsersCtrl);

userRoutes.delete("/:id", deleteUsersCtrl);

userRoutes.get("/:id", fetchUserDetailCtrl);

module.exports = userRoutes;
