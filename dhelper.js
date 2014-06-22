/**
 * Created with IntelliJ IDEA.
 * User: billtt
 * Date: 13-10-8
 * Time: 下午1:18
 * To change this template use File | Settings | File Templates.
 */

var settings = require('./settings');

module.exports = function (req, res, next) {
  res.locals.user = req.session.user;
  res.locals.types = settings.types;
  var err = req.flash('error');
  if (err.length) {
    res.locals.error = err;
  } else {
    res.locals.error = null;
  }
  var info = req.flash('info');
  if (info.length) {
    res.locals.info = info;
  } else {
    res.locals.info = null;
  }
  next();
};
