/**
 * Created with IntelliJ IDEA.
 * User: billtt
 * Date: 13-10-8
 * Time: 上午10:46
 * To change this template use File | Settings | File Templates.
 */

const mongodb = require('./db');

function User(name, key, token) {
  this.name = name;
  this.key = key;
  this.token = token;
}

module.exports = User;

User.prototype.save = async function () {
  const db = await mongodb.open();
  const collection = db.collection('users');
  await collection.createIndex('name', { unique: true });
  const result = await collection.insertOne({
    name: this.name,
    key: this.key,
    token: this.token
  });
  return result;
};

async function getOneBy(prop, value) {
  const db = await mongodb.open();
  const collection = db.collection('users');
  const doc = await collection.findOne({ [prop]: value });
  return doc ? new User(doc.name, doc.key, doc.token || '') : null;
}

User.get = function (name) {
  return getOneBy('name', name);
};

User.getByToken = function (token) {
  return getOneBy('token', token);
};

User.prototype.updateToken = async function (token) {
  const db = await mongodb.open();
  const collection = db.collection('users');
  await collection.updateOne({ name: this.name }, { $set: { token } });
  this.token = token;
};