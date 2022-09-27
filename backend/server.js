const express = require("express");
const dbConnect = require("./config/db/dbConnect");
const app = express();
const dotenv = require("dotenv");
const userRoutes = require("./route/users/usersRoute");
const { errorHandler, notFound } = require("./middlewares/error/errorHandler");
const postRoutes = require("./route/posts/postsRoute");
// Config env file
dotenv.config();

// DB
dbConnect();

// Middleware
app.use(express.json());

// Users route
app.use("/api/users", userRoutes);

// Posts route
app.use("/api/posts", postRoutes);

// error handler: MUST below all the routes
app.use(notFound); // error handle will take error from notfound so it must above
app.use(errorHandler);

// server
const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server is running ${PORT}`));
