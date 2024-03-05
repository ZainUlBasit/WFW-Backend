const User = require("../Models/User");

const getAllUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find();
  } catch (err) {
    console.log(err);
  }

  if (!users) {
    return res.status(404).json({ message: "No Company Found...." });
  }
  return res.status(200).json({ users });
};

const addUser = async (req, res, next) => {
  let user;
  const { fullName, email, password, role, pic } = req.body;
  try {
    user = new User({
      fullName,
      email,
      password,
      role,
      pic,
    });
    await user.save();
  } catch (err) {
    console.log(err);
  }

  if (!user) {
    return res.status(500).json({ message: "Unable to add user" });
  }
  return res.status(201).json({ user });
};

// const updateUser async

exports.getAllUsers = getAllUsers;
exports.addUser = addUser;
