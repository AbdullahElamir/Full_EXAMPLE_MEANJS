(function () {
  'use strict';

  angular
    .module('colleges')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'تسجيل الكليات',
      state: 'colleges',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'colleges', {
      title: 'قائمة الكليات',
      state: 'colleges.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'colleges', {
      title: 'إضافة كلية',
      state: 'colleges.create',
      roles: ['user']
    });

    menuService.addSubMenuItem('topbar', 'colleges', {
      title: 'عرض تجريبي للكليات',
      state: 'colleges.show',
      roles: ['user']
    });
  }
}());
