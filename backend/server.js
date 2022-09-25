const express = require("express");
const dbConnect = require("./config/db/dbConnect");
const app = express();
const dotenv = require("dotenv");
const { userRegisterCtrl } = require("./controllers/users/usersCtrl");
// Config env file
dotenv.config();

// DB
dbConnect();

// Middleware
app.use(express.json());

// Register
app.post("/api/users/register", userRegisterCtrl);

// Login
app.post("/api/users/login", (req, res) => {
  //business logic
  res.json({ user: "User Login" });
});

//fetch all user
app.get("/api/users", (req, res) => {
  //business logic
  res.json({ user: "Fetch all users" });
});

// server
const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server is running ${PORT}`));
