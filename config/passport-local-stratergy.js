const passport = require("passport");

const LocalStratergy = require("passport-local").Strategy;

const User = require("../models/user");
// authentication using passport
passport.use(
  new LocalStratergy({ usernameField: "email" }, function (
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


// check if user is authenticated
passport.checkAuthentication = function(req, res, next){

  // if user is signed in then pass on the request to next function
  if(req.isAuthenticated()){
    return next();
  }


  // if the user is not signed in 
  return res.redirect('/users/sign-in');
}

passport.setAuthenticatedUser = function(req, res, next){
  if(req.isAuthenticated()){

    // req.user contains the current sign-in user from session cookie and we are storing it into locals for views
    res.locals.user = req.user;
    // console.log(req.user);
  }
  next();
}
module.exports = passport;
