const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const Item = require("../models/item");
const Folder = require("../models/folder");
const User = require("../models/user");
const passport = require("passport");

const dashboard = asyncHandler(async (req, res, next) => {
  const itemCount = await Item.countDocuments({ userId: req.user._id }).exec();
  const folderCount = await Folder.countDocuments({
    userId: req.user._id,
  }).exec();
  const quantities = await Item.find(
    { userId: req.user._id },
    { quantity: 1, _id: 0 }
  ).exec();
  let totalQty = 0;
  for (qty of quantities) {
    totalQty += qty.quantity;
  }
  const recentItems = await Item.find({ userId: req.user._id }, { name: 1 })
    .sort({ date: -1 })
    .limit(4)
    .populate("folder")
    .exec();
  res.status(200).render("dashboard", {
    items: itemCount,
    folders: folderCount,
    totalQuantity: totalQty,
    user: req.user,
    recentItems,
  });
});

const login_get = asyncHandler(async (req, res, next) => {
  res.status(200).render("login", { passError: null, user: null });
});

const login_post = (req, res, next) => {
  passport.authenticate("local", (error, user, info) => {
    if (error) {
      return next(error);
    }
    if (!user) {
      return res.render("login", { passError: info.message, user: req.body });
    } else {
      req.login(user, (error) => {
        if (error) {
          res.redirect("/login");
        } else {
          res.redirect("/dashboard");
        }
      });
    }
  })(req, res, next);
};

const register_get = asyncHandler(async (req, res, next) => {
  res
    .status(200)
    .render("register", {
      userError: undefined,
      passError: undefined,
      user: null,
      errors: [],
    });
});

const register_post = [
  body("name").trim().isLength({ min: 2 }).escape(),
  body("email").trim().isLength({ min: 2 }).escape(),
  body("password")
    .trim()
    .isLength({ min: 5 })
    .escape()
    .withMessage("Password must be at least 5 characters wrong"),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req.body);
    if (errors.isEmpty()) {
      const userExists = await User.findOne({ email: req.body.email }).exec();
      if (userExists) {
        return res.render("register", {
          passError: undefined,
          userError: "A user with this email already exists",
          user: req.body,
          errors: [],
        });
      }
      if (req.body.password !== req.body.confirmPassword) {
        return res.render("register", {
          passError: "Passwords do not match",
          userError: undefined,
          user: req.body,
          errors: [],
        });
      }
      const hashedPassord = await bcrypt.hash(req.body.password, 10);

      const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassord,
      });

      await user.save();
      req.login(user, (error) => {
        if (error) {
          res.redirect("/login");
        } else {
          res.redirect("/dashboard");
        }
      });
    } else {
      console.log("There are errors:", errors.array());
      res.render("register", {
        errors: errors.array(),
        passError: undefined,
        userError: undefined,
        user: req.body,
      });
    }
  }),
];

const logout = (req, res, next) => {
  req.logout(() => {
    res.redirect("/login");
  });
};

module.exports = {
  dashboard,
  register_get,
  register_post,
  login_get,
  login_post,
  logout,
};
