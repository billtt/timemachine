/**
 * Created with IntelliJ IDEA.
 * User: billtt
 * Date: 13-10-10
 * Time: 上午9:25
 * To change this template use File | Settings | File Templates.
 */

var crypto = require('crypto');
var settings = require('./settings');

/**
 *
 * @param year
 * @param month 1-12
 * @param day 1-31
 * @param period "year", "month" or "day"
 * @returns {{start: Date, end: Date}}
 */
exports.getTimePeriod = function getTimePeriod(year, month, day, period) {
  month--;
  var start = new Date(year, month, day, 0, 0, 0);
  var end = null;
  if (period == "year") {
    start.setMonth(0);
    start.setDate(1);
    end = new Date(year + 1, month, day, 0, 0, 0);
  } else if (period == "month") {
    start.setDate(1);
    end = new Date(month==11 ? (year+1) : year, month==11 ? 0 : (month+1), day, 0, 0, 0);
  } else if (period == "day") {
    end = new Date(start.getTime() + 86400000);
  }
  return {start: start, end: end};
}

exports.escapeRegExp = function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

exports.encodePassword = function encodePassword(passwd) {
  var md5 = crypto.createHash('md5');
  return md5.update(passwd + settings.passwdKey).digest('base64');
};
