var db = require('../db/db');
var mongoose = require('mongoose');

var RhymeSchema = new mongoose.Schema({
  word: String,
  rhymes: Array
});

module.exports = mongoose.model('Rhymes', RhymeSchema);