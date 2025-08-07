const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const BLOG = require("../models/blogSchema");
const User = require("../models/userSchema");
const Comments = require("../models/commentSchema");
const methodOverride = require("method-override");
router.use(methodOverride("_method"));
const { storage, cloudinary } = require("../cloudConfig.js");

const multer = require("multer");
// const upload = multer({ dest: "uploads/" });
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/"); // saved inside public/uploads
//   },
//   filename: function (req, file, cb) {
//     const suffix = Date.now();
//     cb(null, suffix + "-" + file.originalname);
//   },
// });
// const upload = multer({ storage });
/* yaha tak purana tarika tha  */

const upload = multer({ storage });

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

router.post(
  "/add_blogs",
  upload.fields([
    { name: "ImageUrl1", maxCount: 1 },
    { name: "ImageUrl2", maxCount: 1 },
    { name: "ImageUrl3", maxCount: 1 },
  ]),
  async (req, res, next) => {
    try {
      // console.log(req.body);
      // let newBlog = new BLOG(req.body);
      // newBlog.createdBy = req.user._id;
      // await newBlog.save();
      // console.log("new blog saved", newBlog);
      // res.send(req.file);
      const ImageUrl1 = req.files.ImageUrl1 ? req.files.ImageUrl1[0].path : "";
      const ImageUrl2 = req.files.ImageUrl2 ? req.files.ImageUrl2[0].path : "";
      const ImageUrl3 = req.files.ImageUrl3 ? req.files.ImageUrl3[0].path : "";
      const { title, intro, about, location, country } = req.body;
      let newBlog = new BLOG({
        title,
        ImageUrl1,
        ImageUrl2,
        ImageUrl3,
        intro,
        about,
        location,
        country,
        createdBy: req.user._id,
      });
      await newBlog.save();
      res.redirect("/user/home");

      // console.log("file uploaded", req.files.ImageUrl1[0].path);
      // console.log("file uploaded", req.files.ImageUrl2[0].path);
      // console.log("file uploaded", req.files.ImageUrl3[0].path);
    } catch (err) {
      res.send(err);
    }
  }
);

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
    // console.log(blogdata.createdBy);
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

router.patch(
  "/blog/update/:id",
  upload.fields([
    { name: "ImageUrl1", maxCount: 1 },
    { name: "ImageUrl2", maxCount: 1 },
    { name: "ImageUrl3", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      let { id } = req.params;
      // console.log(id);
      // console.log(req.body);
      let blog = await BLOG.findById(id);

      const ImageUrl1 = req.files?.ImageUrl1
        ? req.files.ImageUrl1[0].path
        : blog.ImageUrl1;
      const ImageUrl2 = req.files?.ImageUrl2
        ? req.files.ImageUrl2[0].path
        : blog.ImageUrl2;
      const ImageUrl3 = req.files?.ImageUrl3
        ? req.files.ImageUrl3[0].path
        : blog.ImageUrl3;

      // Destructure from req.body.blog (since you use blog[title], blog[about], etc.)
      const { title, intro, about, location, country } = req.body;
      const updatedBlog = await BLOG.findByIdAndUpdate(
        id,
        {
          // ...req.body.blog,
          title,
          ImageUrl1,
          ImageUrl2,
          ImageUrl3,
          intro,
          about,
          location,
          country,
        },
        { new: true }
      );
      req.flash("success", "blog updated successfully");

      res.redirect(`/blog/details/${id}`);
      // console.log("files", req.files);
    } catch (err) {
      res.send(err);
      req.flash("error", "Something went wrong while updating the blog");
    }
  }
);

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

router.get("/user/:id", async (req, res) => {
  let { id } = req.params;
  let user = await User.findById(id);
  // res.send(user);
  res.render("user.ejs", { user });
});

module.exports = router;
