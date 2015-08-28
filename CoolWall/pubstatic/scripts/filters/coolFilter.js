'use strict';

angular.module('coolWallApp')
  .filter('coolFilter', function () {
    return function (input) {
      return 'coolFilter filter: ' + input;
    };
  });
