const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const ejs = require("ejs");
app.set("view-engine", "ejs");
app.set("views", path.join(__dirname, "./views")); // serving the ejs file and random data or dynamic data through the ejs template
app.use(express.static(path.join(__dirname, "./public"))); //serving the static files
app.use(express.urlencoded({ extended: true })); //for getting data from the form
const session = require("express-session");
const falsh = require("connect-flash");
const mongoose = require("mongoose");
const User = require("./models/userSchema");
const BLOG = require("./models/blogSchema.js");
const Comments = require("./models/commentSchema.js");
const userAuthentication = require("./authconfig.js");
const userRoutes = require("./routes/user");
const blogRoutes = require("./routes/blog");
const commentRoutes = require("./routes/comment");
const passport = require("passport");
ejsMate = require("ejs-mate");
app.engine("ejs", ejsMate);
const methodOverride = require("method-override");
app.use(methodOverride("_method")); // for delete rote and update routes;
userAuthentication(passport);
const sessionSecret = {
  secret: "@supermanSecret",
  resave: false,
  saveUninialized: false,
};

main()
  .then((res) => {
    console.log("backend connected successfully");
  })
  .catch((err) => {
    console.log("some error accured during the backend connection ", err);
  });

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/mydbs");
}

app.use(session(sessionSecret));
app.use(falsh());
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.successMsg = req.flash("success");
  res.locals.errorMsg = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});

app.use("/user", userRoutes);
app.use("/", blogRoutes);
app.use("/", commentRoutes);
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
