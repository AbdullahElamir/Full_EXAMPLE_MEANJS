(function () {
  'use strict';

  angular
    .module('colleges.services')
    .factory('CollegesService', CollegesService);

  CollegesService.$inject = ['$resource'];

  function CollegesService($resource) {
    return $resource('api/colleges/:collegeId', {
      collegeId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
