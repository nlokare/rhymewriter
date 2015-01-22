angular.module('rhymewriter', ['writer', 'ngRoute', 'ngFx'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'app/home/home.html'
      })
      .when('/app/write', {
        templateUrl: 'app/writer/writer.html',
        controller: 'WriterController'
      });
  });