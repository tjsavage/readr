var accounts = require('./routes/accounts');
var routes = require('./routes');

// urls.js
module.exports = function(app, passport) {
    app.get('/', routes.index);
    app.get('/accounts/login', accounts.get_login);
    app.post('/accounts/login', accounts.post_login);

    app.get('/accounts/register', accounts.get_register);
    app.post('/accounts/register', accounts.post_register);

    app.get('/accounts/logout', accounts.get_logout);

}