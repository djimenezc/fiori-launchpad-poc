'use strict';

describe('Filter: coolFilter', function () {

  // load the filter's module
  beforeEach(module('coolWallApp'));

  // initialize a new instance of the filter before each test
  var coolFilter;
  beforeEach(inject(function ($filter) {
    coolFilter = $filter('coolFilter');
  }));

  it('should return the input prefixed with "coolFilter filter:"', function () {
    var text = 'angularjs';
    expect(coolFilter(text)).toBe('coolFilter filter: ' + text);
  });

});
