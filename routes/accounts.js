
exports.get_login = function(req, res) {
    res.render('accounts/login.html', {
        message: req.flash('signupMessage')
    });
}

exports.post_login = function(req, res) {
    res.send(req.body["login-email"]);
}

exports.get_register = function(req, res) {
    res.render('accounts/register.html', {
        message: req.flash('signupMessage')
    });
}

exports.post_register = function(req, res) {
    res.send(req.body["register-email"]);
}

exports.get_logout = function(req, res) {
    req.logout();
    req.redirect("/accounts/login");
}