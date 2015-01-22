angular.module('writer', ['ngAnimate', 'ngFx'])
  .controller('WriterController', function ($scope, Writer) {
    angular.extend($scope, Writer);

    $('#composer').keypress(function () {
      var keycode = (event.keyCode ? event.keyCode : event.which);
      if (keycode == '13') {
        $scope.rhymes = null;
        var text = $scope.song;
        text = text.split('\n');
        var length = text.length - 1;
        text = text[length];
        var word = text.substring(text.lastIndexOf(' ') + 1);
        $scope.fetch(word).then(function (data) {
          $scope.rhymes = data;
        });
      }
    });

    $scope.add = function () {
      var item = this.word;
      var text = $scope.song;
      var newComposition = text + ' ' + item;
      $scope.song = newComposition;
      $('#composer').focus();
    };

    $scope.send = function (songtitle, song, email) {
      var data = {title: songtitle, body: song, email: email};
      $scope.post(data);
      $scope.save(data);
      $('#title').val('');
      $('#composition').val('');
      $('#email').val('');
      $scope.songtitle = '';
      $scope.song = '';
      $scope.email = '';
      $scope.rhymes = null;
    };
  })
  .factory('Writer', function ($http) {
    var rhymes = {};

    rhymes.fetch = function (word) {
      return $http({
        method: 'GET',
        url: word
      }).then(function (res) {
        return res.data;
      });
    };

    rhymes.post = function (data) {
      return $http({
        method: 'POST',
        url: '/send',
        data: data
      }).then(function (res) {
        return res;
      });
    };

    rhymes.save = function (data) {
      return $http({
        method: 'POST',
        url: '/save',
        data: data
      }).then(function (res) {
        return res;
      });
    };

    return rhymes;
  });