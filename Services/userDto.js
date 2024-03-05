const UserDto = (user) => {
  const userdata = {
    _id: user._id,
    name: user.fullName,
    email: user.email,
    role: user.role,
    pic: user.pic,
  };
  return userdata;
};

module.exports = UserDto;
