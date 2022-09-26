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
  followingUserCtrl,
  unFollowUserCtrl,
  blockUserCtrl,
  unBlockUserCtrl,
  generateVerificationTokenCtrl,
  accountVerificationCtrl,
  forgetPasswordToken,
  passwordResetCtrl,
} = require("../../controllers/users/usersCtrl");
const authMiddleware = require("../../middlewares/auth/authMiddleware");

const userRoutes = express.Router();

userRoutes.post("/register", registerUserCtrl);

userRoutes.post("/login", loginUserCtrl);

userRoutes.get("/", authMiddleware, fetchUsersCtrl);

userRoutes.put("/block-user/:id", authMiddleware, blockUserCtrl);

userRoutes.put("/unblock-user/:id", authMiddleware, unBlockUserCtrl);

userRoutes.get("/profile/:id", authMiddleware, userProfileCtrl);

userRoutes.post(
  "/generate-verify-email-token",
  authMiddleware,
  generateVerificationTokenCtrl
);

userRoutes.put("/verify-account", accountVerificationCtrl);

userRoutes.post("/forget-password-token", forgetPasswordToken);

// Password reset
userRoutes.put("/reset-password", passwordResetCtrl);

userRoutes.put("/password", authMiddleware, updateUserPasswordCtrl);

userRoutes.put("/follow", authMiddleware, followingUserCtrl);

userRoutes.put("/unFollow", authMiddleware, unFollowUserCtrl);

// Bring all the routes with dynamic ids /:id below other routes
userRoutes.put("/:id", authMiddleware, updateUserCtrl);

userRoutes.delete("/:id", deleteUsersCtrl);

userRoutes.get("/:id", fetchUserDetailCtrl);

module.exports = userRoutes;
