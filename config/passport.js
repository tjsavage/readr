// config/passport.js

var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');

module.exports = function(passport) {
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
}