// routes/accounts.js
var forgot = require('password-reset')(require('../config/forgot.js'));

var User = require('../models/user');

exports.get_login = function(req, res) {
    res.render('accounts/login.html', {
        message: req.flash('loginMessage')
    });
};

exports.get_register = function(req, res) {
    res.render('accounts/register.html', {
        message: req.flash('signupMessage')
    });
};

exports.get_logout = function(req, res) {
    req.logout();
    req.redirect("/accounts/login");
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
    });
    var reset = forgot(email, function(err) {
        if (err) {
            res.end("Error sending message.");
        }
        res.render('accounts/forgot-done.html');

        reset.on('request', function(req_, res_) {
            req_.session.reset = { email: email, id: reset.id };
            res_.render('accounts/forgot-email.html');
        });
    });
};

exports.get_reset = function(req, res) {
    res.render('accounts/reset.html', {
        message: req.flash('resetMessage')
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
        res.redirect("/accounts/reset");
    }

    User.findOne({"local.email": req.session.reset.email}, function(err, user) {
        if (err) throw err;

        user.local.password = password;
        user.save(function(err) {
            if (err) throw err;

            res.redirect("/accounts/login");
        });
    });

    forgot.expire(req.session.reset.id);
    delete req.session.reset;
};