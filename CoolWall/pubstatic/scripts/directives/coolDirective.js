'use strict';

angular.module('coolWallApp')
  .directive('menuSlideout', ['$swipe', '$document', '$rootScope', '$animate', function ($swipe, $document, $rootScope, $animate) {
    return {
      restrict: 'A',
      link: function (scope, $elem, attrs) {

        var openClass = 'menu-slideout-open',
        	closeClass = 'menu-slideout-closed',
            transitionClass = 'menu-slideout-transition',
            isSlidingClass = 'menu-slideout-is-sliding';

        $rootScope.$on('toggleSlideMenu', function(event, isOpen) {
        	console.log("a");
            if (isOpen) {
                $animate.addClass($elem, openClass);
                $animate.removeClass($elem, closeClass);
            }
            else {
            	$animate.addClass($elem, closeClass);
            }
        });
      }
    };
  }]);
