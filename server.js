var express = require('express');
var Generator = require('./rhymeGenerator/rhymeGenerator.js');
var _ = require('underscore');

var app = express();

app.listen(4568);

app.get('/:rhyme', function (req, res) {
  Generator.getRhymes(req.params.rhyme)
    .then(Generator.objectifyRhymes)
    .then(function (data) {
      var rhymes = Object.keys(data);
      var words = [];
      _.each(rhymes, function (word) {
        word = '<p>' + word + '</p>';
        words.push(word);
      });
      res.send(words.join(''));
    })
    .catch(function (err) {
      console.log(err);
    });
});
