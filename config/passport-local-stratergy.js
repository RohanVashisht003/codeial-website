const passport = require("passport");

const passportLocal = require("passport-local").Strategy;

const User = require("../models/user");
// authentication using passport
passport.use(
  new passportLocal({ usernameField: "email" }, function (
    email,
    password,
    done
  ){
    // find a user and establish identity
    User.findOne({ email: email }, function (err, user) {
      if (err) {
        console.log("Error in finding user");
        return done(err);
      }
      if (!user || user.password != password) {
        console.log("Invalid username/password");
        return done(null, false);
      }
      return done(null, user);
    });
  })
);

// serializing the user to decide which key to kept in cookies
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

// deserializing the user from key in the cookies
passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    if (err) {
      console.log("Error in finding user");
      return done(err);
    }
    return done(null, user);
  });
});

module.exports = passport;
