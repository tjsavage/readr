var accounts = require('./routes/accounts');
var reader = require('./routes/reader');
var routes = require('./routes');
var middleware = require('./middleware');

// urls.js
module.exports = function(app, passport) {
    app.get('/', routes.index);
    app.get('/accounts/login', accounts.get_login);
    app.post('/accounts/login', passport.authenticate('local-login', {
        successRedirect: '/dashboard',
        failureRedirect: '/accounts/login',
        failureFlash: true
    }));

    app.get('/accounts/register', accounts.get_register);
    app.post('/accounts/register', passport.authenticate('local-signup', {
        successRedirect: '/dashboard',
        failureRedirect: '/accounts/register',
        failureFlash: true
    }));

    app.get('/accounts/logout', accounts.get_logout);

    app.get('/dashboard', middleware.isLoggedIn, reader.dashboard);

}