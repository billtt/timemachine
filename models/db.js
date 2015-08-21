/**
 * Created with IntelliJ IDEA.
 * User: billtt
 * Date: 13-10-2
 * Time: 下午3:59
 * To change this template use File | Settings | File Templates.
 */

var settings = require('../settings');
var MongoClient = require('mongodb').MongoClient;

exports.open = function(callback) {
    MongoClient.connect(settings.dbUrl, callback);
};
