// routes/accounts.js
var bcrypt = require("bcrypt");

var mailer = require("../mailer/models");
var User = require('../models/user');
var locals = require('../config/locals');

exports.get_login = function(req, res) {
    res.render('accounts/login.html', {
        message: req.flash('loginMessage'),
        next: req.query.next
    });
};

exports.get_register = function(req, res) {
    res.render('accounts/register.html', {
        message: req.flash('signupMessage')
    });
};

exports.get_logout = function(req, res) {
    req.logout();
    res.redirect("/accounts/login");
};

exports.get_forgot = function(req, res) {
    res.render('accounts/forgot.html',{
        message: req.flash('forgotMessage')
    });
};

exports.post_forgot = function(req, res) {
    var email = req.body.email;
    User.findOne({"local.email": email}, function(err, user) {
        if (err) throw err;
        if (!user) {
            req.flash('forgotMessage', 'No user found with that email address.');
            return res.redirect("/accounts/forgot");
        }

        var salt = bcrypt.genSaltSync(10);
        var resetHash = bcrypt.hashSync((new Date().toString()) + email, salt);
        var resetToken = encodeURIComponent(resetHash);
        user.local.reset = {
            token: resetHash,
            timestamp: Date.now()
        };

        user.save(function(err) {
            if (err) throw err;
            // Send forgot email
            mailer.sendOne("password-reset", {
                email: email,
                subject: "Reset your password.",
                resetUrl: locals.siteUrl + 'accounts/reset?resetToken=' + resetToken
            }, function(err) {
                if (err) throw err;
                res.render('accounts/forgot-done.html');
            });
        });
    });
};

exports.get_reset = function(req, res) {
    var token = decodeURIComponent(req.query.resetToken);

    console.log(token);
    if (!token) {
        req.flash('forgotMessage', 'Invalid reset link.');
        return res.redirect('/accounts/forgot');
    }
    User.findOne({"local.reset.token": token}, function(err, user) {
        if (err) throw err;
        if (!user) {
            req.flash('forgotMessage', 'The reset link you clicked is not valid. Send another one?');
            return res.redirect('/accounts/forgot');
        }

        var tokenTime = user.local.reset.timestamp;
        var resetTime = new Date(tokenTime.getTime() + 20*60000);
        console.log(tokenTime, resetTime, Date.now().toString());
        if (resetTime < Date.now()) {
            req.flash('forgotMessage', 'The reset link you clicked is no longer valid. Send another one?');
            return res.redirect('/accounts/forgot');
        }

        req.session.reset = {
            token: token,
            email: user.local.email
        };

        res.render('accounts/reset.html', {
            message: req.flash('resetMessage')
        });
    });
};

exports.post_reset = function(req, res) {
    if (!req.session.reset) {
        return res.end("Reset token not set");
    }

    var password = req.body.password;
    var confirm = req.body.confirm;
    if (password !== confirm) {
        req.flash('resetMessage', "Passwords don't match.");
        return res.redirect("/accounts/reset");
    }

    User.findOne({"local.email": req.session.reset.email}, function(err, user) {
        if (err) throw err;

        user.local.password = password;
        user.save(function(err) {
            if (err) throw err;
            req.flash('loginMessage', "Password reset successfully. Please log in.");
            return res.redirect("/accounts/login");
        });
    });

    delete req.session.reset;
};