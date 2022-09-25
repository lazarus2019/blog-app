const mongoose = require("mongoose");

const dbConnect = async () => {
  try {
    await mongoose
      .connect(process.env.MONGODB_URI)
      .then(() => console.log("connected to mongodb"));
  } catch (error) {
    console.log(`Error ${error.message}`);
  }
};

module.exports = dbConnect;
