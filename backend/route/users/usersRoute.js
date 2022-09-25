const express = require("express");
const {
  registerUserCtrl,
  loginUserCtrl,
} = require("../../controllers/users/usersCtrl");

const userRoutes = express.Router();

userRoutes.post("/register", registerUserCtrl);

userRoutes.post("/login", loginUserCtrl);
//fetch all user
userRoutes.get("/", (req, res) => {
  res.json({ user: "Fetch all users" });
});

module.exports = userRoutes;
