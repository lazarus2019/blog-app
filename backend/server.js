const express = require("express");
const dbConnect = require("./config/db/dbConnect");
const app = express();
const dotenv = require("dotenv");
const userRoutes = require("./route/users/usersRoute");
// Config env file
dotenv.config();

// DB
dbConnect();

// Middleware
app.use(express.json());

// Users route
app.use("/api/users", userRoutes);

// server
const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server is running ${PORT}`));
