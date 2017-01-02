/*
 * GET home page.
 */

var User = require('../models/user');
var Slice = require('../models/slice');
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
    today.setHours(0, 0, 0, 0);
    Slice.getDateRangeList(user.name, today, today, function(err, slices) {
      if (!slices) {
        slices = [];
      }
      today = util.simpleDateText(today);
      res.locals.slices = slices;
      res.locals.start = today;
      res.locals.end = today;
      res.render('home');
    });
  });

  app.get('/travel', function(req, res) {
    var user = req.session.user;
    if (!user) {
      return res.redirect('index');
    }
    var start = req.query.start;
    var end = req.query.end;
    Slice.getDateRangeList(user.name, new Date(start), new Date(end), function(err, slices) {
      if (!slices) {
        slices = [];
      }
      res.locals.slices = slices;
      res.locals.start = start;
      res.locals.end = end;
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
      today = util.simpleDateText(new Date());
      res.locals.slices = slices;
      res.locals.start = today;
      res.locals.end = today;
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
