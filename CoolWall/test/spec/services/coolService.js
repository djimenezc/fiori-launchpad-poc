'use strict';

describe('Service: Coolservice', function () {

  // load the service's module
  beforeEach(module('coolWallApp'));

  // instantiate service
  var Coolservice;
  beforeEach(inject(function (_Coolservice_) {
    Coolservice = _Coolservice_;
  }));

  it('should do something', function () {
    expect(!!Coolservice).toBe(true);
  });
});
