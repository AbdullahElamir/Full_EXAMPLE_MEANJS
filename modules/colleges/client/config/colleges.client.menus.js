(function () {
  'use strict';

  angular
    .module('colleges')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Colleges',
      state: 'colleges',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'colleges', {
      title: 'List Colleges',
      state: 'colleges.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'colleges', {
      title: 'Create College',
      state: 'colleges.create',
      roles: ['user']
    });

    menuService.addSubMenuItem('topbar', 'colleges', {
      title: 'show College',
      state: 'colleges.show',
      roles: ['user']
    });
  }
}());
