const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const token = require("../middlewares/token");
const sendMail = require("../middlewares/mail");
const crypto = require("crypto");
const sendVerifyEmail = require("../middlewares/forgotEmail");

const Register = async (req, res, next) => {
  try {
    const { email, password, username } = req.body;
    if (!email) return res.status(400).json("Email is Required");
    if (!password) return res.status(400).json("Password is Required");
    if (!username) return res.status(400).json("Username is Required");
    const oldUser = await User.findOne({ email });
    if (oldUser) {
      return res.status(404).json("Email Already Used");
    } else {
      const code = await crypto.randomBytes(32).toString("hex");
      const hashPassword = await bcrypt.hash(password, 16);
      const user = new User({
        email: email,
        username: username,
        password: hashPassword,
        token: code,
      });
      await user.save();
      const msg = `${process.env.BASE_URL}/authenticate/${user._id}/${user.token}`;
      await sendMail(user.email, "Email Verification", msg);
      res.status(200).json("Registration Success");
    }
  } catch (error) {
    next(error);
  }
};

const updatePassword = async (req, res, next) => {
  let { id } = req.params;
  console.log(id);
  const { password } = req.body;
  try {
    await User.findById(id).then(async (data) => {
      if (data) {
        const hashPassword = await bcrypt.hash(password, 16);
        await User.findByIdAndUpdate(
          data._id,
          { password: hashPassword },
          { new: true }
        );

        res.status(200).json("Password Updated Successfully");
      } else {
        return res.status(404).json("something wrong happened");
      }
    });
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  let { email } = req.body;
  try {
    await User.findOne({ email }).then(async (data) => {
      if (!data) {
        return res.status(404).json("User Not Found");
      }
      const msg = `${process.env.BASE_URL}/changepassword/${data._id}/${data.token}`;
      await sendVerifyEmail(data.email, msg);
      res.status(200).json(`An Email Has been sent to ${data.email}`);
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(402).json("All Fields Are Required");
    }
    const user = await User.findOne({ email });
    const correctPassword = await user.comparePassword(password);
    if (!correctPassword) {
      return res.status(404).json("Incorrect Password");
    }
    res.status(201).json({
      username: user.username,
      email: user.email,
      token: token(user),
    });
  } catch (error) {
    next(error);
  }
};

const authenticate = async (req, res, next) => {
  const { token, id } = req.params;
  try {
    if (!token || !id) {
      return res
        .status(404)
        .json("A problem Occured While authenticating your account");
    }
    const user = await User.findOne({ _id: id });
    if (!user) {
      return res.status(404).json("User Not Found");
    }
    if (token !== user.token) {
      return res.status(404).json("A Problem Occured Please Try Again later");
    }
    await User.findByIdAndUpdate(id, { isVerified: true }, { new: true });
    res.status(200).json("Email Verified Successfully");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  Register,
  login,
  authenticate,
  forgotPassword,
  updatePassword,
};
