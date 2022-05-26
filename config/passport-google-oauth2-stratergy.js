const passport = require('passport');
const googleStratergy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');
const env = require('./environment');

// tell passport to use new stratergy for google login
passport.use(new googleStratergy({
    clientID: env.google_client_id,
    clientSecret: env.google_client_secret,
    callbackURL: env.google_callback_url
},
       
    function (accessToken, refreshToken, profile, done) {
        User.findOne({
            email: profile.emails[0].value
        }).exec(function (err, user) {
            if (err) {
                console.log('error in google-stratergy', err);
                return;
            }
            console.log(profile);

            if (user) {
                // if found , set user as req.user;
                return done(null, user);
            } else {
                // if not found, create user and set it req.user;
                User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(20).toString('hex')
                }, function (err, user) {
                    if (err) {
                        console.log("Error in creating user", err);
                        return;
                    }
                    return done(null, user);
                })
            }
        });
    }
));

module.exports = passport;