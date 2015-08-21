/**
 * Created with IntelliJ IDEA.
 * User: billtt
 * Date: 13-10-8
 * Time: 上午10:46
 * To change this template use File | Settings | File Templates.
 */

var mongodb = require('./db');

function User(name, key) {
  this.name = name;
  this.key = key;
}

module.exports = User;

User.prototype.save = function save(callback) {
  var data = {
    name: this.name,
    key: this.key
  };
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    db.collection('users', function (err, collection) {
      if (err) {
        db.close();
        return callback(err);
      }
      collection.ensureIndex('name', {unique: true, safe: false}, function(err) {
        if (err) {
          db.close();
          return callback(err);
        }
        collection.insert(data, {}, function (err, data) {
          db.close();
          callback(err, data);
        });
      });
    });
  });
};

User.get = function get(name, callback) {
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    db.collection('users', function (err, collection) {
      if (err) {
        db.close();
        return callback(err);
      }
      collection.findOne({name: name}, function (err, doc) {
        db.close();
        if (doc) {
          var user = new User(doc.name, doc.key);
          callback(err, user);
        } else {
          callback(err, null);
        }
      });
    });
  });
};
