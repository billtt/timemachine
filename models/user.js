/**
 * Created with IntelliJ IDEA.
 * User: billtt
 * Date: 13-10-8
 * Time: 上午10:46
 * To change this template use File | Settings | File Templates.
 */

var mongodb = require('./db');

function User(name, key, token) {
  this.name = name;
  this.key = key;
  this.token = token;
}

module.exports = User;

User.prototype.save = function save(callback) {
  var data = {
    name: this.name,
    key: this.key,
    token: this.token
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

function getOneBy(prop, value, callback) {
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    db.collection('users', function (err, collection) {
      if (err) {
        db.close();
        return callback(err);
      }
      let query = {};
      query[prop] = value;
      collection.findOne(query, function (err, doc) {
        db.close();
        if (doc) {
          var user = new User(doc.name, doc.key, doc.token ? doc.token : '');
          callback(err, user);
        } else {
          callback(err, null);
        }
      });
    });
  });
};

User.get = function get(name, callback) {
    return getOneBy('name', name, callback);
}

User.getByToken = function get(token, callback) {
    return getOneBy('token', token, callback);
};

User.prototype.updateToken = function updateToken(token, callback) {
  let _this = this;
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    db.collection('users', function (err, collection) {
      if (err) {
        db.close();
        return callback(err);
      }
      collection.update({name: _this.name}, {$set: {token: token}}, function (err, data) {
        if (!err) {
          _this.token = token;
        }
        db.close();
        return callback(err);
      });
    });
  });
};
