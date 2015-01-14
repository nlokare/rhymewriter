var http = require('http');
var Promise = require('bluebird');

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
    for (var i = 0; i < results.length; i++) {
      rhymes[results[i]['word']] = results[i];
    }
    resolve(rhymes);
  });
};

exports.getRhymes("yes")
  .then(exports.objectifyRhymes)
  .then(function (data) {
    console.log(Object.keys(data)); //in express, do res.send(Object.keys(data));
  })
  .catch(function (err) {
    console.log(err);
  });


