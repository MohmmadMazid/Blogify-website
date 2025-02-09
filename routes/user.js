const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/userSchema.js");
const BLOG = require("../models/blogSchema.js");
const passport = require("passport");
const flash = require("connect-flash");
const methodOverride = require("method-override");
router.use(methodOverride("_method"));

const isAuthenticated = async (req, res, next) => {
  console.log(req.user);

  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/user/signin");
  }
};

router.get("/home", async (req, res) => {
  try {
    const blogdata = await BLOG.find();
    // console.log(blogdata);
    res.render("./home.ejs", { blogdata });
  } catch (err) {
    res.send(err);
  }
});

router.get("/signin", (req, res) => {
  try {
    res.render("./signin.ejs");
  } catch (err) {
    res.send(err);
  }
});
router.get("/signup", (req, res) => {
  try {
    res.render("./signup.ejs");
  } catch (err) {
    res.send(err);
  }
});

router.post("/signup", async (req, res, next) => {
  try {
    let { username, email, password } = req.body;
    let user = await User.findOne({ username: username });
    if (user) {
      req.flash("error", "try again , something went wrong !");
    }
    //pre saved middleware of mongoose

    const newUser = new User({ username, email, password });
    await newUser.save();

    //BUILTIN LOGIN FUNCTION WHICH MAKES YOU REDIREC  T ON THAT PAGE WHERE HAVE YOU COMING FROM
    req.login(newUser, (err) => {
      if (err) {
        return next();
      }
      req.flash("success", "you sign up successfully");
      // res.redirect("/user/signin");
      res.redirect("/user/home");
    });
  } catch (err) {
    res.send(err);
  }
});

router.post(
  "/signin",
  passport.authenticate("local", {
    // successRedirect: "/user/home",
    // failureRedirect: "/user/signin",
  }),
  (req, res) => {
    try {
      req.flash("success", "you are sign in successfully");
      req.flash("erro", "wrong email or password");
      res.redirect("/user/home");
    } catch (err) {
      res.send(err);
    }
  }
);

router.get("/logout", (req, res) => {
  try {
    req.logout((err) => {
      if (err) return res.status(500).send("Error logging out");
      req.flash("success", "you are logged out  successfully");
      res.redirect("/user/signin");
    });
  } catch (err) {
    res.send(err);
  }
});

module.exports = router;
