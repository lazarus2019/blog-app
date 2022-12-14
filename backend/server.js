const express = require("express");
const dbConnect = require("./config/db/dbConnect");
const app = express();
const dotenv = require("dotenv");
const userRoutes = require("./route/users/usersRoute");
const { errorHandler, notFound } = require("./middlewares/error/errorHandler");
const postRoutes = require("./route/posts/postsRoute");
const commentRoutes = require("./route/comments/commentRoute");
const emailMsgRoutes = require("./route/emailMsg/emailMsgRoute");
const categoryRoutes = require("./route/category/categoryRoute");
const cors = require("cors");
// Config env file
dotenv.config();

// DB
dbConnect();

// Allow CORS policy
app.use(cors());

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Users route
app.use("/api/users", userRoutes);

// Posts route
app.use("/api/posts", postRoutes);

// Comment route
app.use("/api/comments", commentRoutes);

// Email route
app.use("/api/email", emailMsgRoutes);

// Category route
app.use("/api/category", categoryRoutes);

// error handler: MUST below all the routes
app.use(notFound); // error handle will take error from notfound so it must above
app.use(errorHandler);

// server
const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server is running ${PORT}`));
