/**
 * Created with IntelliJ IDEA.
 * User: billtt
 * Date: 13-10-2
 * Time: 下午3:59
 * To change this template use File | Settings | File Templates.
 */

var settings = require('../settings');
var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;

module.exports = new Db(settings.db, new Server(settings.host, Connection.DEFAULT_PORT, {}), {safe: true});
