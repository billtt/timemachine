/*
 * GET home page.
 */

const User = require('../models/user');
const Slice = require('../models/slice');
const util = require('../util');
const apiRoutes = require('./api');
const router = require('express').Router();

router.get('/', (req, res) => {
  res.redirect('index');
});

router.get('/index', (req, res) => {
  if (req.session.user) {
    res.redirect('home');
  } else {
    const key = req.flash('key');
    if (key.length > 0) {
      res.locals.key = key;
      res.locals.username = req.flash('username');
    }
    res.render('index');
  }
});

router.post('/reg', async (req, res) => {
  try {
    const name = req.body.name;
    const passwd = util.encodePassword(req.body.password);
    const existingUser = await User.get(name);
    if (existingUser) {
      req.flash('error', 'Username already taken!');
      return res.redirect('index');
    }
    const user = new User(name, passwd, '');
    await user.save();
    req.flash('info', 'You have successfully registered!');
    res.redirect('index');
  } catch (err) {
    req.flash('error', err.message || 'Registration failed');
    res.redirect('index');
  }
});

router.post('/login', async (req, res) => {
  try {
    const name = req.body.name;
    const passwd = util.encodePassword(req.body.password);
    const user = await User.get(name);
    if (!user || user.key !== passwd) {
      req.flash('error', 'Login error!');
      return res.redirect('index');
    }
    req.session.user = user;
    res.redirect('home');
  } catch (err) {
    req.flash('error', 'Login failed');
    res.redirect('index');
  }
});

router.get('/logout', (req, res) => {
  req.session.user = null;
  res.redirect('index');
});

router.get('/home', async (req, res) => {
  const user = req.session.user;
  if (!user) {
    return res.redirect('index');
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const slices = await Slice.getDateRangeList(user.name, today, today) || [];
  const todayText = util.simpleDateText(today);
  res.locals.slices = slices;
  res.locals.start = todayText;
  res.locals.end = todayText;
  res.locals.travel = false;
  res.render('home');
});

router.get('/travel', async (req, res) => {
  const user = req.session.user;
  if (!user) {
    return res.redirect('index');
  }
  const start = req.query.start;
  const end = req.query.end;
  const slices = await Slice.getDateRangeList(user.name, new Date(start), new Date(end)) || [];
  res.locals.slices = slices;
  res.locals.start = start;
  res.locals.end = end;
  res.locals.travel = true;
  res.render('home');
});

router.get('/search', async (req, res) => {
  const user = req.session.user;
  if (!user) {
    return res.redirect('index');
  }
  const key = req.query.key;
  const slices = await Slice.search(user.name, key) || [];
  const todayText = util.simpleDateText(new Date());
  res.locals.slices = slices;
  res.locals.start = todayText;
  res.locals.end = todayText;
  res.locals.keyword = key;
  res.render('home');
});

router.post('/add', async (req, res) => {
  const user = req.session.user;
  if (!user) {
    return res.redirect('index');
  }
  let time;
  const dateStr = req.body.date;
  const timeStr = req.body.time;
  if (dateStr && timeStr) {
    time = new Date(`${dateStr} ${timeStr}`);
  } else {
    time = new Date();
  }
  const slice = new Slice(req.body.content, req.body.type, user.name, time);
  await slice.save();
  res.redirect('home');
});

router.get('/remove', async (req, res) => {
  const user = req.session.user;
  if (!user) {
    return res.redirect('index');
  }
  const id = req.query.id;
  await Slice.remove(user.name, id);
  res.setHeader('Content-Type', 'text/json');
  res.end('{}');
});

module.exports = router;
