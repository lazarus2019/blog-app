const express = require("express");
const { userRegisterCtrl } = require("../../controllers/users/usersCtrl");

const userRoutes = express.Router();

userRoutes.post("/register", userRegisterCtrl);

userRoutes.post("/login", (req, res) => {
  res.json({ user: "User Login" });
});

//fetch all user
userRoutes.get("/", (req, res) => {
  res.json({ user: "Fetch all users" });
});

module.exports = userRoutes;
