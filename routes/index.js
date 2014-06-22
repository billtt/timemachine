/*
 * GET home page.
 */

var User = require('../models/user');
var Slice = require('../models/slice');
var Day = require('../models/day');
var uuid = require('node-uuid');
var util = require('../util');

function route(app) {
  app.get('/', function(req, res) {
    res.redirect('index');
  });

  app.get('/index', function(req, res) {
    if (req.session.user) {
      res.redirect('home');
    } else {
      var key = req.flash('key');
      if (key.length>0) {
        res.locals.key = key;
        res.locals.username = req.flash('username');
      }
      res.render('index');
    }
  });

  app.post('/reg', function(req, res) {
    var name = req.body.name;
    var passwd = req.body.password;
    passwd = util.encodePassword(passwd);
    User.get(name, function(err, user) {
      if (user) {
        req.flash('error', 'Username already taken!');
        return res.redirect('index');
      }
      user = new User(name, passwd);
      user.save(function(err) {
        if (err) {
          req.flash('error', err);
          return res.redirect('index');
        }
        req.flash('info', 'You have successfully registered!');
        res.redirect('index');
      });
    });
  });

  app.post('/login', function(req, res) {
    var name = req.body.name;
    var passwd = req.body.password;
    passwd = util.encodePassword(passwd);
    User.get(name, function(err, user) {
      if (!user || user.key != passwd) {
        req.flash('error', 'Login error!');
        return res.redirect('index');
      }
      req.session.user = user;
      res.redirect('home');
    });
  });

  app.get('/logout', function(req, res) {
    req.session.user = null;
    res.redirect('index');
  });

  app.get('/home', function(req, res) {
    var user = req.session.user;
    if (!user) {
      return res.redirect('index');
    }
    var today = new Date();
    Slice.getDayList(user.name, today.getFullYear(), today.getMonth()+1, today.getDate(), function(err, slices) {
      if (!slices) {
        slices = [];
      }
      var day = new Day(today);
      res.locals.slices = slices;
      res.locals.day = day;
      res.locals.today = day;
      res.render('home');
    });
  });

  app.get('/travel', function(req, res) {
    var user = req.session.user;
    if (!user) {
      return res.redirect('index');
    }
    var year = req.query.year;
    var month = req.query.month;
    var day = req.query.day;
    var period = req.query.period;
    if (!day) {
      day = 1;
    }
    Slice.getList(user.name, year, month, day, period, function(err, slices) {
      if (!slices) {
        slices = [];
      }
      res.locals.slices = slices;
      res.locals.day = new Day(new Date(year, month-1, day), period);
      res.locals.today = new Day(new Date());
      res.render('home');
    });
  });

  app.get('/search', function(req, res) {
    var user = req.session.user;
    if (!user) {
      return res.redirect('index');
    }
    var key = req.query.key;
    Slice.search(user.name, key, function(err, slices) {
      if (!slices) {
        slices = [];
      }
      var day = new Day(new Date());
      res.locals.slices = slices;
      res.locals.day = day;
      res.locals.today = day;
      res.locals.keyword = key;
      res.render('home');
    });
  });

  app.post('/add', function(req, res) {
    var user = req.session.user;
    if (!user) {
      return res.redirect('index');
    }
    var dateStr = req.body.date;
    var timeStr = req.body.time;
    var time = null;
    if (dateStr && dateStr.length>0 && timeStr && timeStr.length>0) {
      time = new Date(dateStr + ' ' + timeStr);
    } else {
      time = new Date();
    }
    var slice = new Slice(req.body.content, req.body.type, user.name, time);
    slice.save(function() {
      res.redirect('home');
    });
  });

  app.get('/remove', function(req, res) {
    var user = req.session.user;
    if (!user) {
      return res.redirect('index');
    }
    var id = req.query.id;
    Slice.remove(user.name, id, function() {
      res.setHeader('Content-Type', 'text/json');
      res.end('{}');
    });
  });
}

exports.route = route;
