const LocalStretgy = require("passport-local").Strategy;
const User = require("./models/userSchema");

function userAuthentication(passport) {
  passport.use(
    new LocalStretgy(async (username, password, done) => {
      try {
        const user = await User.findOne({ username: username });
        // console.log(user); //for checking user is in database or not
        if (!user) {
          return done(null, false);
        }
        const ismatch = await user.comparePassword(password);
        if (!ismatch) {
          console.log("user not found"); //if password will not match then return user not found

          return done(null, false);
        } else {
          return done(null, user); //when youser logeed in sucessfully
        }
      } catch (err) {
        return done(err);
      }
    })
  );
  passport.serializeUser((user, done) => done(null, user.id)); //return the user id
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id); //find the user with the help of user.id
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
}
module.exports = userAuthentication;
