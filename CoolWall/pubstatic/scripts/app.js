'use strict';

angular.module('coolWallApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ngTouch',
  'ngAnimate'
])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: '/views/main.html',
        controller: 'TilesCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  }]);
