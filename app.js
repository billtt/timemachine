/**
 * Module dependencies.
 */

var express = require('express');
var session = require('express-session');
var logger = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var errorHandler = require('express-error-handler');
var cors = require('cors');

var webRouter = require('./routes/web');
var apiRouter = require('./routes/api');

var http = require('http');
var path = require('path');
var flash = require('connect-flash');
var dhelper = require('./dhelper');

var app = express();

var MongoStore = require('connect-mongo');
var settings = require('./settings');

// all environments
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride());
app.use(cookieParser());
app.use(session({
  secret: settings.cookieSecret,
  store: MongoStore.create({
    mongoUrl: settings.dbUrl
  })
}));
app.use(flash());
app.use(dhelper);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(errorHandler());
}

app.use('/api', apiRouter);
app.use('/', webRouter);

var server = express();
server.set('port', process.env.PORT || 3000);
var basePath = process.argv.length > 2 ? process.argv[2] : '';
server.use(basePath, app);

http.createServer(server).listen(server.get('port'), function () {
  console.log('Express server listening on port ' + server.get('port'));
});
