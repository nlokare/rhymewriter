var db = require('../db');
var mongoose = require('mongoose');

var SongSchema = new mongoose.Schema({
  profileUrl: String,
  title: String,
  song: String
});

module.exports = mongoose.model('Song', SongSchema);