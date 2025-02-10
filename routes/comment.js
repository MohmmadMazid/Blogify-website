const express = require("express");
const router = express.Router();
const User = require("../models/userSchema.js");
const Comments = require("../models/commentSchema.js");
const BLOG = require("../models/blogSchema.js");
const methodOverride = require("method-override");
router.use(methodOverride("_method"));

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash("error", "you must be signed in");
    res.redirect("/user/signin");
  }
};

router.post("/add-comments/:userId/:blogId", async (req, res) => {
  try {
    let { userId, blogId } = req.params;
    let userdata = await User.findById(userId);
    // let blog = await BLOG.find({ createdBy: userId }); //findin the blog data
    let blogdata = await BLOG.findById(blogId);
    let addcomment = new Comments(req.body); //ading user id into the comment schema
    blogdata.comments.push(addcomment._id);
    await blogdata.save();
    addcomment.commnetedBy = userdata._id;
    await addcomment.save();
    // console.log("blog insidethe comments ", blog);
    // blog.comments.push(addcomment);

    res.redirect(`/blog/details/${blogId}`);
  } catch (err) {
    res.send(err);
  }
});

router.delete("/commentDelete/:cmId/:id", isAuthenticated, async (req, res) => {
  try {
    let { cmId, id } = req.params;
    console.log(cmId);
    console.log(id);
    await Comments.findByIdAndDelete(cmId);
    res.redirect(`/blog/details/${id}`);
  } catch (err) {
    res.send(err);
  }
});
module.exports = router;
