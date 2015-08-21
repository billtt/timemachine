/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var flash = require('connect-flash');
var dhelper = require('./dhelper');

var app = express();

var MongoStore = require('connect-mongo')(express);
var settings = require('./settings');

// all environments
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({
  secret: settings.cookieSecret,
  store: new MongoStore({
    url: settings.dbUrl
  })
}));
app.use(flash());
app.use(dhelper);
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

routes.route(app);

var server = express();
server.set('port', process.env.PORT || 3000);
var basePath = process.argv.length > 2 ? process.argv[2] : '';
server.use(basePath, app);

http.createServer(server).listen(server.get('port'), function () {
  console.log('Express server listening on port ' + server.get('port'));
});
