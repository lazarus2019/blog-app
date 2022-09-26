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

//// User profile
const userProfileCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const myProfile = await User.findById(id);
    res.json(myProfile);
  } catch (error) {
    res.json(error);
  }
});

//// Update profile
const updateUserCtrl = expressAsyncHandler(async (req, res) => {
  const { _id } = req?.user;
  validateMongodbId(_id);

  const user = await User.findByIdAndUpdate(
    _id,
    {
      firstName: req?.body?.firstName,
      lastName: req?.body?.lastName,
      email: req?.body?.email,
      bio: req?.body?.bio,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.json(user);
});

//// Update password
const updateUserPasswordCtrl = expressAsyncHandler(async (req, res) => {
  // Destruct the login user
  const { _id } = req.user;
  const { password } = req.body;
  validateMongodbId(_id);

  // Find the user by _id
  const user = await User.findById(_id);

  if (password && !(await user.isPasswordMatched(password))) {
    user.password = password;
    const updatedUser = await user.save();
    // Put `return` before the res if cannot set header error appear
    return res.json(updatedUser);
  }
  res.json(user);
});

//// Following user
const followingUserCtrl = expressAsyncHandler(async (req, res) => {
  const { followId } = req.body;
  const loginUserId = req.user.id;

  // Find the target user and check if the login id exist
  const targetUser = await User.findById(followId);

  const alreadyFollowing = targetUser?.followers?.find(
    (user) => user?.toString() === loginUserId.toString()
  );

  if (alreadyFollowing) throw new Error("You already followed this user");

  // 1. Find the user you want to follow and update it's followers field
  await User.findByIdAndUpdate(
    followId,
    {
      // append a specified value to an array
      // Docs: https://www.mongodb.com/docs/manual/reference/operator/update/push/
      $push: { followers: loginUserId },
    },
    { new: true }
  );

  // 2. Update the login user following field
  await User.findByIdAndUpdate(
    loginUserId,
    {
      $push: { following: followId },
    },
    { new: true }
  );

  res.json("following");
});

//// UnFollowing user
const unFollowUserCtrl = expressAsyncHandler(async (req, res) => {
  const { unFollowId } = req.body;
  const loginUserId = req.user.id;

  await User.findByIdAndUpdate(
    unFollowId,
    {
      // remove all instances of value match
      // Docs: https://www.mongodb.com/docs/manual/reference/operator/update/pull/
      $pull: { followers: loginUserId },
    },
    { new: true }
  );

  await User.findByIdAndUpdate(
    loginUserId,
    {
      $pull: { following: unFollowId },
    },
    { new: true }
  );

  res.json("You have successfully unfollowed this user");
});

//// Block user
const blockUserCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  const loginUserId = req.user.id;

  await User.findByIdAndUpdate(loginUserId, {
    $push: { blockUsers: id },
  });

  res.json("Block user successfully");
});

//// Block user
const unBlockUserCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  const loginUserId = req.user.id;

  await User.findByIdAndUpdate(loginUserId, {
    $pull: { blockUsers: id },
  });

  res.json("Un-Block user successfully");
});

module.exports = {
  // register: registerUserCtrl
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
};
