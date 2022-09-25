const User = require("../../model/user/User");

const userRegisterCtrl = async (req, res) => {
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
};

module.exports = {
  // register: userRegisterCtrl
  userRegisterCtrl,
};
