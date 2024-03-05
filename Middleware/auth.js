const JwtService = require("../Services/JwtServices");

const auth = async (req, res, next) => {
  try {
    const { accesstoken } = req.cookies;
    if (!accesstoken) {
      throw new Error("Please login first");
    }
    const userData = await JwtService.verifyAccessToken(accesstoken);
    if (!userData) {
      throw new Error("No user found");
    }
    req.user = userData;
    next();
  } catch (error) {
    return res.status(401).json({ msg: error.message });
  }
};

module.exports = auth;
