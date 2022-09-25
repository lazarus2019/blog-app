const express = require("express");
const {
  registerUserCtrl,
  loginUserCtrl,
  fetchUsersCtrl,
  deleteUsersCtrl,
  fetchUserDetailCtrl,
  userProfileCtrl,
  updateUserCtrl,
  updateUserPasswordCtrl,
} = require("../../controllers/users/usersCtrl");
const authMiddleware = require("../../middlewares/auth/authMiddleware");

const userRoutes = express.Router();

userRoutes.post("/register", registerUserCtrl);

userRoutes.post("/login", loginUserCtrl);

userRoutes.get("/", authMiddleware, fetchUsersCtrl);

userRoutes.get("/profile/:id", authMiddleware, userProfileCtrl);

userRoutes.put("/:id", authMiddleware, updateUserCtrl);

userRoutes.put("/password/", authMiddleware, updateUserPasswordCtrl);

userRoutes.delete("/:id", deleteUsersCtrl);

userRoutes.get("/:id", fetchUserDetailCtrl);

module.exports = userRoutes;
