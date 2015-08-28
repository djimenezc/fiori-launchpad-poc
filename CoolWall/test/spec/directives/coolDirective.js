'use strict';

describe('Directive: coolDirective', function () {

  // load the directive's module
  beforeEach(module('coolWallApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<nav></nav>');
    element = $compile(element)(scope);

    expect(element).toBeDefined();
    //console.info(element.hasClass('ng-scope'));
    expect(element.hasClass('ng-scope')).toEqual(true);
  }));
});
