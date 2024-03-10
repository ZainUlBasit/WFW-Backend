const JwtService = require("../Services/JwtServices");
const { createError } = require("../utils/ResponseMessage");

const VerifyUserCookie = async (req, res, next) => {
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
    return createError(res, 401, error.message);
  }
};
const VerifyBranch = async (req, res, next) => {
  try {
    if (req.user.role !== 2)
      throw new Error("Unauthorized to access this route!");
    next();
  } catch (error) {
    return createError(res, 401, error.message);
  }
};
const VerifyAdmin = async (req, res, next) => {
  console.log(req.user);
  try {
    if (req.user.role !== 1)
      throw new Error("Unauthorized to access this route!");
    next();
  } catch (error) {
    return createError(res, 401, error.message);
  }
};
const VerifyBranchId = async (req, res, next) => {
  try {
    if (req.user.branch !== req.body.branch)
      throw new Error("Branch # not matched!");
    next();
  } catch (error) {
    return createError(res, 401, error.message);
  }
};

module.exports = {
  VerifyUserCookie,
  VerifyAdmin,
  VerifyBranch,
  VerifyBranchId,
};
