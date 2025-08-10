require("dotenv").config();

const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const path = require("path");
const ejs = require("ejs");
app.set("view-engine", "ejs");
app.set("views", path.join(__dirname, "./views")); // serving the ejs file and random data or dynamic data through the ejs template
app.use(express.static(path.join(__dirname, "./public"))); //serving the static files
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//for getting data from the form
const session = require("express-session");
const MongoStore = require("connect-mongo");

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

const MONGO_URL = process.env.ATLAS_DATABASE_URL;
userAuthentication(passport);

const store = MongoStore.create({
  mongoUrl: MONGO_URL,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 60 * 60,
});

store.on("error", () => {
  console.log("error in mongo URL means MONGO_URL", error);
});

const sessionSecret = {
  store: store,
  secret: process.env.SECRET,
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
  // await mongoose.connect("mongodb://127.0.0.1:27017/mydbs");
  await mongoose.connect(MONGO_URL);
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
app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
