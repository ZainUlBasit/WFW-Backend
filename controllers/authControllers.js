const Joi = require("joi");
const bcrypt = require("bcrypt");
const User = require("../Models/User");
const userDto = require("../Services/userDto");
const JwtService = require("../Services/JwtServices");
const RefreshModel = require("../Models/RefreshToken");

function authControllers() {
  return {
    login: async (req, res) => {
      console.log(req.body);
      // validate the req
      const loginSchema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
      });

      const { error } = loginSchema.validate(req.body);
      if (error) {
        return res.status(422).json({ message: "Hike" });
      }

      // check useremail
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res
          .status(422)
          .json({ message: "Email or password incorrect1" });
      }

      // check user password using bcrypt
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(403)
          .json({ message: "Email or password incorrect2" });
      }
      const { accessToken, refreshToken } = JwtService.generateToken({
        _id: user._id,
        role: user.role,
      });

      const result = await JwtService.storeRefreshToken(refreshToken, user._id);
      if (!result) {
        return res.status(500).json({
          message: "Internal server error.Cannot store refresh token",
        });
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

      const userdata = userDto(user);
      return res.json({ userdata });
    },
    register: async (req, res) => {
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
        pic: Joi.string().required(),
      });
      const { error } = registerSchema.validate(req.body.values);
      if (error) {
        return res.status(422).json({ message: error.message });
      }

      // check if email has not register yet
      const { name, email, password, confirmPassword, pic, role } = req.body;
      const user = await User.exists({ email });
      if (user) {
        return res.status(409).json({ message: "Email already registered" });
      }

      if (!name || !pic || !role || !email || !password || !confirmPassword) {
        return res.status(422).json({ message: "All fields are required" });
      }
      if (password !== confirmPassword) {
        return res.status(422).json({ message: "Password not matching" });
      }

      let newUser;
      try {
        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // register user
        newUser = new User({
          name,
          email,
          password: hashedPassword,
          role,
          pic,
        });

        const isSaved = await newUser.save();
        if (!isSaved) {
          return res
            .status(500)
            .json({ message: "Internal server error.Could not register user" });
        }
      } catch (error) {
        return res
          .status(500)
          .json({ message: "Internal server error.Please try again" });
      }

      return res.status(201).json(newUser);
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
        return res.status(500).json({ message: err.message });
      }
      return res.json({ message: "Logout successfully" });
    },
    autoLogin: async (req, res) => {
      const { refreshtoken: refreshTokenFromCookies } = req.cookies;
      if (!refreshTokenFromCookies) {
        return res.status(401).json({ message: "Token not found" });
      }
      let userData;
      try {
        userData = await JwtService.verifyRefreshToken(refreshTokenFromCookies);
      } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
      }

      try {
        const token = await JwtService.findRefreshToken(
          userData._id,
          refreshTokenFromCookies
        );
        if (!token) {
          return res.status(401).json({ message: "Invalid Token" });
        }
      } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
      }

      const userExist = await User.findById(userData._id);
      if (!userExist) {
        return res.status(404).json({ message: "Invalid user" });
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
        return res.status(500).json({ message: "Internal server error" });
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
      return res.json({ userdata });
    },
  };
}

module.exports = authControllers;
