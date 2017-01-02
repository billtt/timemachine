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

exports.escapeRegExp = function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

exports.encodePassword = function encodePassword(passwd) {
  var md5 = crypto.createHash('md5');
  return md5.update(passwd + settings.passwdKey).digest('base64');
};

exports.simpleDateText = function simpleDateText(date) {
  return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
};
