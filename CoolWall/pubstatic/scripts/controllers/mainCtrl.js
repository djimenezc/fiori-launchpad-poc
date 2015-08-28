'use strict';

angular.module('coolWallApp')
    .controller('MainCtrl', ['$scope', function ($scope) {
    	
        $scope.openMenu = false;
        $scope.toggleMenu = function () {
            $scope.$emit('toggleSlideMenu', $scope.openMenu = !$scope.openMenu);
        };

        $scope.$on('slideMenuToggled', function (event, isOpen) {
            $scope.openMenu = isOpen;
        });
    	
    }]);


