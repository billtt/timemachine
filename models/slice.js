/**
 * Created with IntelliJ IDEA.
 * User: billtt
 * Date: 13-10-9
 * Time: 下午12:08
 * To change this template use File | Settings | File Templates.
 */

const mongodb = require('./db');
const util = require('../util');
const { ObjectId } = require('mongodb');

function Slice(content, type, user, time, id) {
  this.content = content;
  this.type = type && type.length > 1 ? type : 'other';
  this.user = user;
  this.time = time || new Date();
  this.id = id;
}

module.exports = Slice;

const sprintf = require("sprintf-js").sprintf;

Slice.prototype.timeText = function () {
  return sprintf('%04d.%02d.%02d %02d:%02d', this.time.getFullYear(), this.time.getMonth() + 1, this.time.getDate(), this.time.getHours(), this.time.getMinutes());
};

Slice.getDateRangeList = async function (user, start, end) {
  const db = await mongodb.open();
  const collection = db.collection('slices');
  end = new Date(end.getTime() + 86400000);
  const docs = await collection.find({ user, time: { $gte: start, $lt: end } }).toArray();
  return docs.map(doc => new Slice(doc.content, doc.type, doc.user, doc.time, doc._id)).reverse();
};

Slice.update = async function (id, content, time) {
  const db = await mongodb.open();
  const collection = db.collection('slices');
  const result = await collection.updateOne({ _id: new ObjectId(id) }, { $set: { content, time } });
  return result;
};

Slice.prototype.save = async function () {
  const db = await mongodb.open();
  const collection = db.collection('slices');
  await collection.createIndex('name');
  await collection.createIndex('time');
  const result = await collection.insertOne({
    user: this.user,
    time: this.time,
    content: this.content,
    type: this.type
  });
  return result;
};

Slice.remove = async function (user, id) {
  const db = await mongodb.open();
  const collection = db.collection('slices');
  const result = await collection.deleteOne({ user, _id: new ObjectId(id) });
  return result.deletedCount;
};

Slice.search = async function (user, keyword) {
  const db = await mongodb.open();
  const collection = db.collection('slices');
  if (keyword.startsWith('/')) {
    keyword = keyword.slice(1);
  } else {
    keyword = util.escapeRegExp(keyword).toLowerCase();
  }
  const docs = await collection.find({ user, content: new RegExp(keyword, 'i') }).toArray();
  return docs.map(doc => new Slice(doc.content, doc.type, doc.user, doc.time, doc._id)).reverse();
};
