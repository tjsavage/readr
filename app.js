
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var swig = require('swig');
var consolidate = require('consolidate');
var passport = require('passport');
var flash = require('connect-flash');
var mongoose = require('mongoose');

var middleware = require('./middleware');
var configDB = require('./config/database.js');
var configPassport = require('./config/passport');

mongoose.connect(configDB.url);

var app = express();

app.configure(function() {
    // all environments
    app.set('port', process.env.PORT || 3000);
    app.set('view engine', 'html');
    app.set('views', path.join(__dirname, 'views'));
    app.engine('.html', consolidate.swig);
    app.locals({
        siteName: "Readr"
    });

    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.methodOverride());
    app.use(express.cookieParser('your secret here'));
    app.use(express.session());

    app.use(passport.initialize());
    app.use(passport.session());
    app.use(flash());

    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));

    // development only
    if ('development' == app.get('env')) {
      app.use(express.errorHandler());
    }

    configPassport(passport);
});

require('./urls.js')(app, passport);



http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
