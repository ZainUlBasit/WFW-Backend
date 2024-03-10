const Joi = require("joi");
const bcrypt = require("bcrypt");
const User = require("../Models/User");
const userDto = require("../Services/userDto");
const JwtService = require("../Services/JwtServices");
const RefreshModel = require("../Models/RefreshToken");
const { createError, successMessage } = require("../utils/ResponseMessage");

function authControllers() {
  return {
    login: async (req, res) => {
      // validate the req
      const loginSchema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
      });

      const { error } = loginSchema.validate(req.body);
      if (error) return createError(res, 422, error.message);

      // check useremail
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) return createError(res, 422, "No such email registered!");

      // check user password using bcrypt
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return createError(res, 403, "email or password doesn't match!");
      const jwtBody =
        user.role === 1
          ? {
              _id: user._id,
              role: user.role,
            }
          : user.role === 2 && {
              _id: user._id,
              role: user.role,
              branch: user.branch,
            };
      const { accessToken, refreshToken } = JwtService.generateToken(jwtBody);

      const result = await JwtService.storeRefreshToken(refreshToken, user._id);
      if (!result)
        return createError(
          res,
          500,
          "Internal server error.Cannot store refresh token"
        );

      // store  access token and refresh token in cookies
      res.cookie("refreshtoken", refreshToken, {
        maxAge: 1000 * 60 * 60 * 24 * 30, //2 hour
        httpOnly: true,
      });

      res.cookie("accesstoken", accessToken, {
        maxAge: 1000 * 60 * 60, // 1 hour
        httpOnly: true,
      });

      const userdata = userDto(user);
      return successMessage(res, userdata, "Successfully Logged In!");
    },
    register: async (req, res) => {
      const { name, email, password, confirmPassword, role, branch } = req.body;
      // validate req using joi
      const registerSchema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string()
          .pattern(new RegExp("^[a-zA-Z0-9]{5,15}$"))
          .required()
          .min(8)
          .max(15)
          .messages({
            "string.pattern.base":
              "Password must include alphabets and numbers",
            "string.min": "Password must be minimum 8 character required",
            "string.max": "Password must be upto 15 characters ",
          }),
        confirmPassword: Joi.ref("password"),
        role: Joi.number().valid(1, 2, 3).required(),
        branch: Joi.number().valid(1, 2, 3),
      });
      const { error } = registerSchema.validate(req.body);
      if (error) return createError(res, 422, error.message);
      // if role is branch(2) then check the branch #
      else if (req.body.role === 2 && !req.body.branch) {
        return createError(res, 422, "Branch # is required for Role Branch");
      }
      // if role is branch(2) then check the branch # exist or not
      else if (req.body.role === 2 && req.body.branch) {
        const user = await User.exists({ branch });
        if (user) return createError(res, 409, "Branch # already registered");
      }

      // check if email has not register yet
      const user = await User.exists({ email });
      if (user) return createError(res, 409, "Email already registered");
      if (password !== confirmPassword)
        return createError(res, 422, "Password not matching");

      let newUser;
      try {
        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        const payload =
          role === 2
            ? { name, email, password: hashedPassword, role, branch }
            : role === 2 && { name, email, password: hashedPassword, role };
        // register user
        newUser = new User(payload);
        const isSaved = await newUser.save();
        if (!isSaved)
          return createError(
            res,
            500,
            "Internal server error.Could not register user"
          );
        return successMessage(res, newUser, `${name} successfully registered!`);
      } catch (err) {
        return createError(res, 500, err.message || err);
      }
    },
    logout: async (req, res) => {
      console.log(req.user._id);
      try {
        const token = await RefreshModel.findOneAndRemove({
          userId: req.user._id,
        });
        if (!token) {
          return res.status(422).json({ message: "Token not found" });
        }
        res.clearCookie("accesstoken");
        res.clearCookie("refreshtoken");
      } catch (err) {
        return createError(res, 500, err.message || err);
      }
      return successMessage(res, null, "Logout successfully");
    },
    autoLogin: async (req, res) => {
      const { refreshtoken: refreshTokenFromCookies } = req.cookies;
      if (!refreshTokenFromCookies) {
        return createError(res, 401, "Token not found");
      }
      let userData;
      try {
        userData = await JwtService.verifyRefreshToken(refreshTokenFromCookies);
      } catch (error) {
        return createError(res, 401, error.message);
      }

      try {
        const token = await JwtService.findRefreshToken(
          userData._id,
          refreshTokenFromCookies
        );
        if (!token) {
          return createError(res, 401, "Invalid Token!");
        }
      } catch (error) {
        return createError(res, 401, error.message);
      }

      const userExist = await User.findById(userData._id);
      if (!userExist) {
        return createError(res, 404, "Invalid User!");
      }

      const { accessToken, refreshToken } = JwtService.generateToken({
        _id: userData._id,
        role: userData.role,
      });
      try {
        const result = await JwtService.updateRefreshToken(
          userData._id,
          refreshToken
        );
      } catch (error) {
        return createError(res, 500, error.message);
      }

      // store  access token and refresh token in cookies
      res.cookie("refreshtoken", refreshToken, {
        maxAge: 1000 * 60 * 60 * 24 * 30, //2 hour
        httpOnly: true,
      });

      res.cookie("accesstoken", accessToken, {
        maxAge: 1000 * 60 * 60, // 1 hour
        httpOnly: true,
      });
      const userdata = userDto(userExist);
      return successMessage(res, userdata, null);
    },
  };
}

module.exports = authControllers;
