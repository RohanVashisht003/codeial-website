const User = require("../models/user");

module.exports.profile = function (req, res) {
  User.findById(req.params.id, function(err, user){
    return res.render("user_profile", {
      title: "Users Profile",
      profile_user:user
    });
  });
};

// render signup page
module.exports.signUp = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/users/profile");
  }
  return res.render("user_signup", {
    title: "Codeial | Sign Up",
  });
};

// render signin page
module.exports.signIn = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/users/profile");
  }
  return res.render("user_signin", {
    title: "Codeial | Sign In",
  });
};
module.exports.destroySession = function (req, res) {
  req.logout();
  return res.redirect("/");
};
// get the sign in data
module.exports.create = function (req, res) {
  if (req.body.password !== req.body.confirm_password) {
    return res.redirect("back");
  }

  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) {
      console.log("Error in finding user in signing Up");
      return;
    }

    if (!user) {
      User.create(req.body, function (err, user) {
        if (err) {
          console.log("Error in finding user in signing Up");
          return;
        }
        return res.redirect("/users/sign-in");
      });
    } else {
      return res.redirect("back");
    }
  });
};

// sign in and create session for user
module.exports.createSession = function (req, res) {
  return res.redirect("/");
};
