const expressAsyncHandler = require("express-async-handler");
const generateToken = require("../../config/token/generateToken");
const crypto = require("crypto");
const User = require("../../model/user/User");
const {
  mailgun,
  mailHeader,
  verifyEmailTemplate,
} = require("../../utils/mailgun");
const validateMongodbId = require("../../utils/validateMongodbID");
const {
  cloudinaryUploadImg,
  cloudinaryUploadWithoutSaveToStorage,
  cloudinaryDeleteWithId,
} = require("../../utils/cloudinary");
const { removeFileByPath } = require("../../middlewares/uploads/photoUpload");
const { getPublicId } = require("../../utils/uploadFile");

//// Register user
const registerUserCtrl = expressAsyncHandler(async (req, res) => {
  const userExists = await User.findOne({ email: req?.body?.email });
  if (userExists) throw new Error("User already exists!");

  try {
    // Register user
    const user = await User.create({
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
    const myProfile = await User.findById(id).populate("posts");
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

//// Un-Block user
const unBlockUserCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  const loginUserId = req.user.id;

  await User.findByIdAndUpdate(loginUserId, {
    $pull: { blockUsers: id },
  });

  res.json("Un-Block user successfully");
});

//// Generate verification token
const generateVerificationTokenCtrl = expressAsyncHandler(async (req, res) => {
  const { email, firstName, lastName } = req.user;
  const loginUserId = req.user.id;

  const user = await User.findById(loginUserId);

  // Generate token
  const token = await user.createAccountVerificationToken();
  const url = `verify-account/${token}`;
  try {
    await user.save();

    const msg = mailHeader({
      email,
      firstName,
      lastName,
      html: verifyEmailTemplate({
        email,
        firstName,
        lastName,
        url,
      }),
    });

    await mailgun()
      .messages()
      .send(msg, (error, body) => {
        if (error) {
          console.log(error);
        } else {
          console.log(body);
        }
      });
  } catch (error) {
    throw new Error(`Can not send the email ${error}`);
  }
  res.json({ token });
});

//// Account verification
const accountVerificationCtrl = expressAsyncHandler(async (req, res) => {
  const { token } = req.body;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  // find this user by token
  const userFound = await User.findOne({
    accountVerificationToken: hashedToken,
    accountVerificationTokenExpires: { $gt: new Date() },
  });

  if (!userFound) throw new Error("Token expired, try again later");
  // Update the props to true
  userFound.isAccountVerified = true;
  userFound.accountVerificationToken = undefined;
  userFound.accountVerificationTokenExpires = undefined;
  await userFound.save();

  res.json(userFound);
});

//// Forget token generator
const forgetPasswordToken = expressAsyncHandler(async (req, res) => {
  // find the user by email
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw new Error("User Not Found");

  const token = await user.createPasswordResetToken();
  const url = `reset-password/${token}`;
  try {
    await user.save();

    const msg = mailHeader({
      email,
      firstName: user.firstName,
      lastName: user.lastName,
      html: verifyEmailTemplate({
        email,
        firstName,
        lastName,
        url,
      }),
    });

    await mailgun()
      .messages()
      .send(msg, (error, body) => {
        if (error) {
          console.log(error);
        } else {
          console.log(body);
        }
      });
  } catch (error) {
    throw new Error(`Can not send the email ${error}`);
  }
  res.json({
    msg: `A verification message is successfully send to ${user?.email}. Reset now within 10 minutes ${token}`,
  });
});

//// Password reset
const passwordResetCtrl = expressAsyncHandler(async (req, res) => {
  const { token, password } = req.body;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  // Find user by token
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) throw new Error("Token Expired, try again later");

  // Update/change the password
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  res.json(user);
});

//// Profile photo upload
const profilePhotoUploadCtrl = expressAsyncHandler(async (req, res) => {
  const { _id } = req.user;

  //// Way 1: Upload file => save to storage => resizing => upload to cloudinary
  // 1. Get the oath to img
  // const localPath = `public/images/profile/${req.file.filename}`;
  // 2. Upload to cloudinary
  // const imgUploaded = await cloudinaryUploadImg(localPath);

  //// Way 2: Upload file => resizing and convert to buffer => upload to cloudinary
  const imgUploaded = await cloudinaryUploadWithoutSaveToStorage(req.file);

  // Update user profile photo URL
  const foundUser = await User.findByIdAndUpdate(
    _id,
    {
      profilePhoto: imgUploaded?.url,
    },
    { new: true }
  );

  // Only use this if save file to storage (Way 1)
  // await removeFileByPath(localPath);
  res.json(foundUser);
});

const removeFileByPublicId = expressAsyncHandler(async (req, res) => {
  const { public_url } = req.body;
  cloudinaryDeleteWithId(getPublicId(public_url));
  res.json("Deleted successfully");
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
  generateVerificationTokenCtrl,
  accountVerificationCtrl,
  forgetPasswordToken,
  passwordResetCtrl,
  profilePhotoUploadCtrl,
  removeFileByPublicId,
};
