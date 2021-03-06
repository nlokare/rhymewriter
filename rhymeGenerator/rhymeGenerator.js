var http = require('http');
var Promise = require('bluebird');
var _ = require('underscore');

var RHYMEBRAIN = 'http://rhymebrain.com/talk?function=getRhymes&word='; //URL BASE FOR RHYMEBRAIN API

exports.getRhymes = function (string) {
  return new Promise(function (resolve, reject) {
    var url = RHYMEBRAIN + string;
    http.get(url, function (res) {
      var data = '';
      res.on('data', function (chunk) {
        data += chunk;
      });
      res.on('end', function () {
        resolve(data);
      });
    });
  });
};

exports.objectifyRhymes = function (data) {
  return new Promise(function (resolve, reject) {
    var rhymes = {};
    var results = JSON.parse(data);
    var counter = 0;
    _.each(results, function (entry) {
      if (counter <= 45) {
        rhymes[entry['word']] = entry;
        counter++;
      }
    });
    resolve(rhymes);
  });
};


