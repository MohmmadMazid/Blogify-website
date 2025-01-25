const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const BLOG = require("../models/blogSchema");
const User = require("../models/userSchema");
const Comments = require("../models/commentSchema");
const methodOverride = require("method-override");
router.use(methodOverride("_method"));
const isAuthenticated = async (req, res, next) => {
  // console.log(req.user);

  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash("error", "you must be signed in !");
    res.redirect("/user/signin");
  }
};

router.get("/add_blogs", isAuthenticated, (req, res) => {
  // req.flash("error", "you must be signed in");
  res.render("./addBlogForm.ejs");
});

router.post("/add_blogs", async (req, res) => {
  try {
    //   console.log(req.body);
    let newBlog = new BLOG(req.body);
    newBlog.createdBy = req.user._id;
    await newBlog.save();
    // console.log("new blog saved", newBlog);
    res.redirect("/user/home");
  } catch (err) {
    res.send(err);
  }
});

router.get("/blog/details/:id", isAuthenticated, async (req, res) => {
  try {
    let { id } = req.params;
    let blogdata = await BLOG.findById(id).populate("createdBy");
    let blogComments = await BLOG.findById(id).populate({
      path: "comments",
      populate: {
        path: "commnetedBy",
      },
    });
    let commentdata = await Comments.find().populate("commnetedBy");
    res.render("./blogdetails.ejs", {
      user: req.user,
      blogdata,
      blogComments,
    });
  } catch (err) {
    res.send(err);
  }
});

router.delete("/blog/delete/:id", isAuthenticated, async (req, res) => {
  try {
    let { id } = req.params;
    // let deletedBlog = await BLOG.findByIdAndDelete(id);
    req.flash("success", "blog deleted successfully");
    let deletedBlog = await BLOG.findByIdAndDelete(id);

    res.redirect("/user/home");
  } catch (err) {
    res.send(err);
  }
});

router.get("/blog/update/:id", isAuthenticated, async (req, res) => {
  try {
    let { id } = req.params;
    console.log(id);
    let blogdata = await BLOG.findById(id);

    res.render("./updateBlogForm.ejs", {
      user: req.user,
      blogdata,
    });
  } catch (err) {
    res.send(err);
  }
});

router.patch("/blog/update/:id", async (req, res) => {
  try {
    let { id } = req.params;
    console.log(id);
    // console.log(req.body.blog);
    const updatedBlog = await BLOG.findByIdAndUpdate(id, { ...req.body.blog });
    req.flash("success", "blog updated successfully");

    res.redirect(`/blog/details/${id}`);
  } catch (err) {
    res.send(err);
  }
});

router.get("/user/blogs/:id", async (req, res) => {
  try {
    let { id } = req.params;
    console.log(id);
    let blogsdata = await BLOG.find({ createdBy: id });
    // console.log(blogsdata);
    res.render("./yourBlog.ejs", { blogsdata });
  } catch (err) {
    res.send(err);
  }
});

module.exports = router;
