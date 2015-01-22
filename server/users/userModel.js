var db = require('../db/db');
var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  profileUrl: String,
  firstName: String,
  lastName: String
});

module.exports = mongoose.model('User', UserSchema);