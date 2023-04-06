/**
 * Created with IntelliJ IDEA.
 * User: billtt
 * Date: 13-10-9
 * Time: 下午12:08
 * To change this template use File | Settings | File Templates.
 */

var mongodb = require('./db');
var util = require('../util');
var bson = require('bson');
var uuid = require('node-uuid');

function Slice(content, type, user, time, id) {
  this.content = content;
  this.type = type && type.length>1 ? type : 'other';
  this.user = user;
  this.time = time ? time : new Date();
  this.id = id;
}

module.exports = Slice;

var sprintf = require("sprintf-js").sprintf;

Slice.prototype.timeText = function timeText() {
  return sprintf('%04d.%02d.%02d %02d:%02d', this.time.getFullYear(), this.time.getMonth()+1, this.time.getDate(),
    this.time.getHours(), this.time.getMinutes());
};

/**
 *
 * @param user
 * @param start {Date}
 * @param end {Date}
 * @param callback
 */
Slice.getDateRangeList = function getRangeList(user, start, end, callback) {
  mongodb.open(function(err, db) {
    if (err) {
      return callback(err);
    }
    db.collection('slices', function(err, collection) {
      if (err) {
        db.close();
        return callback(err);
      }
      var crit = { user: user };
      end = new Date(end.getTime() + 86400000);
      crit.time = {$gte: start, $lt: end};
      collection.find(crit).toArray(function(err, docs) {
        db.close();
        if (docs) {
          var list = [];
          docs.forEach(function(doc, index) {
            list.unshift(new Slice(doc.content, doc.type, doc.user, doc.time, doc._id));
          });
          return callback(null, list);
        } else {
          return callback(err, null);
        }
      });
    });
  });
};

Slice.prototype.save = function save(callback) {
  var data = {
    user: this.user,
    time: this.time,
    content: this.content,
    type: this.type
  };
  mongodb.open(function(err, db) {
    if (err) {
      return callback(err);
    }
    db.collection('slices', function(err, collection) {
      if (err) {
        db.close();
        return callback(err);
      }
      collection.ensureIndex('name', {safe: false}, function(err) {
        if (err) {
          db.close();
          return callback(err);
        }
        collection.ensureIndex('time', {safe: false}, function(err) {
          if (err) {
            db.close();
            return callback(err);
          }
          collection.insert(data, function(err, data) {
            db.close();
            return callback(err, data);
          });
        });
      });
    });
  });
};

Slice.remove = function remove(user, id, callback) {
  mongodb.open(function(err, db) {
    if (err) {
      return callback(err);
    }
    db.collection('slices', function(err, collection) {
      if (err) {
        db.close();
        return callback(err);
      }
        var BSON = bson.BSONPure;
      collection.remove({user: user, _id: new BSON.ObjectID(id)}, function(err, num) {
        db.close();
        return callback(err, num);
      });
    });
  });
};

Slice.search = function search(user, keyword, callback) {
  mongodb.open(function(err, db) {
    if (err) {
      return callback(err);
    }
    db.collection('slices', function(err, collection) {
      if (err) {
        db.close();
        return callback(err);
      }
      if (keyword.length>0 && keyword.charAt(0)=='/') {
        keyword = keyword.substr(1);
      } else {
        keyword = util.escapeRegExp(keyword).toLowerCase();
      }
      var crit = { user: user, content: new RegExp(keyword, 'i') };
      collection.find(crit).toArray(function(err, docs) {
        db.close();
        if (docs) {
          var list = [];
          docs.forEach(function(doc, index) {
            list.unshift(new Slice(doc.content, doc.type, doc.user, doc.time, doc._id));
          });
          return callback(null, list);
        } else {
          return callback(err, null);
        }
      });
    });
  });
};
