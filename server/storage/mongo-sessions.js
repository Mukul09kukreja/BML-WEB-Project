// Persist browser sessions in MongoDB and reject expired sessions.
const session = require('express-session');
const mongoose = require('mongoose');

// Use the existing MongoDB connection; expired sessions are rejected even before TTL cleanup.
class MongoSessions extends session.Store {
  constructor() {
    super();
    this.collection = mongoose.connection.collection('sessions');
  }
  get(id, done) {
    this.collection.findOne({ _id: id, expires: { $gt: new Date() } })
      .then(row => done(null, row?.data || null), done);
  }
  set(id, data, done) {
    const expires = new Date(data.cookie.expires || Date.now() + 7 * 86400000);
    this.collection.updateOne({ _id: id }, { $set: { data, expires } }, { upsert: true }).then(() => done(), done);
  }
  touch(id, data, done) {
    this.collection.updateOne({ _id: id }, { $set: { expires: new Date(data.cookie.expires) } }).then(() => done(), done);
  }
  destroy(id, done) { this.collection.deleteOne({ _id: id }).then(() => done(), done); }
}
module.exports = MongoSessions;
