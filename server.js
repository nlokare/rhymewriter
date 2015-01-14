var express = require('express');
var Generator = require('./rhymeGenerator/rhymeGenerator.js');

var app = express();

app.get('/rhyme', function (req, res) {
  Generator.getRhymes(req.body)
    .then(Generator.objectifyRhymes)
    .then(function (data) {
      res.send(Object.keys(data));
    })
    .catch(function (err) {
      console.log(err);
    });
});

Generator.getRhymes("focus")
    .then(Generator.objectifyRhymes)
    .then(function (data) {
      console.log(Object.keys(data));
    })
    .catch(function (err) {
      console.log(err);
    });