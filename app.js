
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var swig = require('swig');
var consolidate = require('consolidate');
var middleware = require('./middleware');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', consolidate.swig);

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(middleware.globalLocals);

app.locals({
	siteName: "Readr"
});

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

var accounts = require('./routes/accounts');

app.get('/', routes.index);
app.get('/accounts/login', accounts.get_login);
app.post('/accounts/login', accounts.post_login);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
