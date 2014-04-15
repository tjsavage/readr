var accounts = require('./routes/accounts');
var reader = require('./routes/reader');
var routes = require('./routes');
var essays = require('./routes/essays');
var api = require('./routes/api');
var googleapis = require('./routes/googleapis');
var middleware = require('./middleware');

// urls.js
module.exports = function(app, passport) {
    app.get('/', routes.index);
    app.get('/accounts/login', accounts.get_login);
    app.post('/accounts/login', passport.authenticate('local-login', {
            failureRedirect: '/accounts/login',
            failureFlash: true
        }),
        function(req, res) {
            console.log(req.body);
            if (req.body.next) {
                res.redirect(req.body.next);
            } else {
                res.redirect('/dashboard');
            }
        });

    app.get('/accounts/register', accounts.get_register);
    app.post('/accounts/register', passport.authenticate('local-signup', {
        successRedirect: '/dashboard',
        failureRedirect: '/accounts/register',
        failureFlash: true
    }));

    // Forgot password functionality
    app.get('/accounts/forgot', accounts.get_forgot);
    app.post('/accounts/forgot', accounts.post_forgot);
    app.get('/accounts/reset', accounts.get_reset);
    app.post('/accounts/reset', accounts.post_reset);

    app.get('/accounts/logout', accounts.get_logout);

    app.get('/dashboard', middleware.isLoggedIn, reader.dashboard);
    app.get('/apply', reader.apply);

    app.get('/essays/submit', middleware.isLoggedIn, essays.get_submit);
    app.post('/essays/submit', middleware.isLoggedIn, essays.post_submit);

    app.get('/api/schools', api.schools);
    app.get('/api/schools/:schoolID', api.school);
    app.get('/api/schools/:schoolID/prompts', api.school_prompts);


    app.get('/oauth2configure', googleapis.oauth2configure);
    app.get('/oauth2callback', googleapis.oauth2callback)

}