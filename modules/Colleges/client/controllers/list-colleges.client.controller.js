(function () {
  'use strict';

  angular
    .module('colleges')
    .controller('CollegesListController', CollegesListController);

  CollegesListController.$inject = ['CollegesService'];

  function CollegesListController(CollegesService) {
    var vm = this;

    vm.colleges = CollegesService.query();
  }
}());
