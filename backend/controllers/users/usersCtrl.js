const expressAsyncHandler = require("express-async-handler");
const generateToken = require("../../config/token/generateToken");
const User = require("../../model/user/User");
const validateMongodbId = require("../../utils/validateMongodbID");

//// Register user
const registerUserCtrl = expressAsyncHandler(async (req, res) => {
  const userExists = await User.findOne({ email: req?.body?.email });
  if (userExists) throw new Error("User already exists!");

  try {
    // Register user
    const user = User.create({
      firstName: req?.body?.firstName,
      lastName: req?.body?.lastName,
      email: req?.body?.email,
      password: req?.body?.password,
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
});

//// Login user
const loginUserCtrl = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // check if user exists
  const userFound = await User.findOne({ email });
  if (userFound && (await userFound.isPasswordMatched(password))) {
    res.json({
      id: userFound?._id,
      firstName: userFound?.firstName,
      lastName: userFound?.lastName,
      email: userFound?.email,
      profilePhoto: userFound?.profilePhoto,
      isAdmin: userFound?.isAdmin,
      token: generateToken(userFound?._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid Login Credentials");
  }
});

//// Fetch all users
const fetchUsersCtrl = expressAsyncHandler(async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.json(users);
  } catch (error) {
    res.json(error);
  }
});

//// Delete users
const deleteUsersCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  // check if user id is valid
  validateMongodbId(id);
  try {
    const deleteUser = await User.findByIdAndDelete(id);
    res.json(deleteUser);
  } catch (error) {
    res.json(error);
  }
  if (!id) throw new Error("Please provide user id");
});

//// User detail
const fetchUserDetailCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  // check if user id is valid
  validateMongodbId(id);

  try {
    const user = await User.findById(id);
    res.json(user);
  } catch (error) {
    res.json(error);
  }
});

module.exports = {
  // register: registerUserCtrl
  registerUserCtrl,
  loginUserCtrl,
  fetchUsersCtrl,
  deleteUsersCtrl,
  fetchUserDetailCtrl,
};
